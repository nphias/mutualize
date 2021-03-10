import { Hashed, serializeHash, timestampToMillis } from '../utils/utils';
import { HolochainService } from './holochain.service'
import { Injectable } from '@angular/core';
import { TransactorStore } from '../stores/transactor.store';
import { environment } from '@environment';

export type Dictionary<T> = { [key: string]: T };

export interface Multiparty {
  spender_pub_key: string;
  recipient_pub_key: string;
}

export interface Transaction extends Multiparty {
  amount: number;
  timestamp: number;
  offer_hash: string;
}

export enum OfferState {
  Pending,
  Canceled,
  Rejected,
  Completed,
  Approved
}

export interface Offer extends Multiparty {
  amount: number;
  state: OfferState;
}

@Injectable({
  providedIn: "root"
})
export class PublicTransactorService {
  public zomeName = 'transactor'
  private agent_pub_key!: string //= "DEFAULT_KEY"

  constructor(private hcs:HolochainService, private t_store:TransactorStore) { 
    this.agent_pub_key = t_store.agent_pub_key
   }

  //get agent_pub_key(){return serializeHash(this.hcs.agentKeyByteArray_from_cell)};
  //get cell_holoHash(){return serializeHash(this.hcs.HoloHashByteArray_from_cell)}

  async getMyPublicKey(): Promise<string> {
    return this.hcs.call(this.zomeName,'who_am_i', null);
  }

  async getAgentBalance(agentPubKey: string): Promise<number> {
    return this.hcs.call(this.zomeName,'get_balance_for_agent', agentPubKey);
  }

  async getAgentTransactions(agentPubKey: string): Promise<Array<Hashed<Transaction>>> {
    let transactions
    if (environment.mock){
      let transactions = [{hash:"xyz",content:{spender_pub_key:"123",recipient_pub_key:"456", amount: 2,timestamp:134134,offer_hash:"sdgdd"}}] 
      return transactions
    }
    else{
      console.log(agentPubKey)
      transactions = await this.hcs.call(this.zomeName,'get_transactions_for_agent', agentPubKey);
      console.log(transactions)
      return transactions.map((t: any) => ({
        hash: t.hash,
        content: {
          ...t.content,
          timestamp: timestampToMillis(t.content.timestamp),
        },
      }));
    }
  }

  async getMyTransactions(){
    const transactions = await this.getAgentTransactions(this.agent_pub_key);
    this.t_store.storeMyTransactions(this.agent_pub_key, transactions)
  }

  async queryMyPendingOffers(): Promise<Array<Hashed<Offer>>> {
    if (environment.mock){
      let offer:Offer = {spender_pub_key:"321",recipient_pub_key:"654", amount: 5, state:OfferState['Pending']}
      let offers:Array<Hashed<Offer>> = [{hash:"123", content:offer}]
      return new Promise(()=>{offers})
    }else{
      const offers = await this.hcs.call(this.zomeName,'query_my_pending_offers', null);
      this.t_store.storeMyPendingOffers(this.agent_pub_key,offers)
      return offers
    }
  }

  async createOffer(recipientPubKey: string, amount: number) { 
    if (environment.mock){
      const offer:Offer = {spender_pub_key:this.agent_pub_key,recipient_pub_key:recipientPubKey, amount: amount, state:OfferState['Pending']}
      const offers:Array<Hashed<Offer>> = [{hash:"123", content:offer}]
      this.t_store.storeMyPendingOffers(this.agent_pub_key,offers)
    } else{
      await this.hcs.call(this.zomeName,'create_offer', {
        recipient_pub_key: recipientPubKey,
        amount,
      });
      this.queryMyPendingOffers()
    }
  }

  async acceptOffer(offerHash: string){
    await this.hcs.call(this.zomeName,'accept_offer', offerHash);
    this.getMyTransactions()
  }

  //getMyBalance(){
  //  return this.t_store.getMyBalance()
  //}
   
  async cancelOffer(offerHash: string) {
    if( environment.mock){
      this.t_store.removeOffer(offerHash)
    } else {
      await this.hcs.call(this.zomeName, 'cancel_offer', {
        offer_hash: offerHash,
      });
      this.queryMyPendingOffers()
    }
  }

  async rejectOffer(offerHash: string) {
    await this.hcs.call(this.zomeName,'reject_offer', {
      offer_hash: offerHash,
    });
  } 
}
