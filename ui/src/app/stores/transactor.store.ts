//import { Dictionary } from './transactor-types';
import { Hashed, serializeHash } from '../utils/utils';
import { ProfilesStore } from './profiles.store';
import {
  observable,
  action,
  runInAction,
  computed,
  makeObservable,
} from 'mobx';
import { Dictionary, Offer, Transaction, Multiparty } from '../services/transactor.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: "root"
})
export class TransactorStore {
  @observable
  private offers: Dictionary<Offer> = {};  //todo make private and use getter
  @observable
  private transactions: Dictionary<Transaction> = {};
  private myAgentPubKey:string = "DEFAULT_KEY"


  constructor(
    public profilesStore: ProfilesStore
  ) {
    makeObservable(this);
  }

  get agent_pub_key():string {
   return this.myAgentPubKey    
  }

  set agent_pub_key(agent_pub_key:string){
    this.myAgentPubKey = agent_pub_key
  }

  @computed
  get myPendingOffers(): Hashed<Offer>[] {
    return Object.entries(this.offers)
      .filter(
        ([hash, offer]) =>
          !Object.values(this.transactions).find(t => t.offer_hash == hash)
      )
      .map(([hash, offer]) => ({
        hash,
        content: offer,
      }));
  }

  @computed
  get myTransactions(): Hashed<Transaction>[] {
    return Object.entries(this.transactions)
      .sort(
        ([_, transaction1], [__, transaction2]) =>
          transaction2.timestamp - transaction1.timestamp
      )
      .map(([hash, transaction]) => ({
        hash,
        content: transaction,
      }));
  }

  isOutgoing(multiparty: Multiparty): boolean {
    return multiparty.spender_pub_key === this.myAgentPubKey;
  }

  offer(offerHash: string): Offer {
    return this.offers[offerHash];
  }

  counterpartyKey(multiparty: Multiparty): string {
    return multiparty.recipient_pub_key === this.myAgentPubKey
      ? multiparty.spender_pub_key
      : multiparty.recipient_pub_key;
  }

  counterpartyNickname(multiparty: Multiparty): string {
    const counterpartyKey = this.counterpartyKey(multiparty);

    return this.profilesStore.profileOf(counterpartyKey).nickname;
  }

  @computed
  get OutgoingOffers(): Array<Hashed<Offer>> {
    return this.myPendingOffers.filter(offer => this.isOutgoing(offer.content));
  }

  @computed
  get IncomingOffers(): Array<Hashed<Offer>> {
    return this.myPendingOffers.filter(
      offer => !this.isOutgoing(offer.content)
    );
  }

  @computed
  get MyBalance(): number {
    return Object.values(this.transactions).reduce(
      (acc, next) => acc + (this.isOutgoing(next) ? -next.amount : next.amount),
      0
    );
  }

  @action
  public async storeMyPendingOffers(myAgentPubKey:string, offers:Array<Hashed<Offer>>) {
    //const offers = await this.transactorService.queryMyPendingOffers();

   /* const promises = offers.map(o =>
      this.profilesStore.fetchAgentProfile(this.counterpartyKey(o.content))
    );
    await Promise.all(promises);*/

    offers.forEach(o => this.storeOffer(o));
  }

  @action
  public async storeMyTransactions(agentPubKey: string, transactions:Array<Hashed<Transaction>>) {
    
    //const transactions = await this.transactorService.getAgentTransactions(
    //  this.myAgentPubKey
    //);
   // console.log("hereo")
    //const promises = transactions.map(t =>
    //  this.profilesStore.storeAgentProfile(this.counterpartyKey(agentPubKey,{spender_pub_key:t.content.spender_pub_key, recipient_pub_key:t.content.recipient_pub_key}))
    //);
    //await Promise.all(promises);

    transactions.forEach(t => this.storeTransaction(t));
  }

 /* @action
  public async createOffer(
    recipientPubKey: string,
    amount: number
  ): Promise<void> {
    await this.transactorService.createOffer(recipientPubKey, amount);

    this.fetchMyPendingOffers();
  }*/

  /*@action
  public async acceptOffer(offerHash: string): Promise<void> {
    await this.transactorService.acceptOffer(offerHash);

    runInAction(() => {
      this.fetchMyTransactions();
    });
  }*/

  @action
  public storeOffer(offer: Hashed<Offer>) {
    this.offers[offer.hash] = offer.content;
  }

  @action
  public removeOffer(offerhash: string) {
    delete(this.offers[offerhash]) //= offer.content;
  }

  @action
  public storeTransaction(transaction: Hashed<Transaction>) {
    this.transactions[transaction.hash] = transaction.content;
  }
}
