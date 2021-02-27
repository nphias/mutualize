import { Hashed, timestampToMillis } from '../utils/utils';
import { HolochainService } from './holochain.service'
import { Injectable } from '@angular/core';

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

export type OfferState =
  | 'Pending'
  | 'Canceled'
  | 'Rejected'
  | 'Completed'
  | 'Approved';

export interface Offer extends Multiparty {
  amount: number;

  state: OfferState;
}

@Injectable({
  providedIn: "root"
})
export class PublicTransactorService {
  public zomeName = 'transactor'

  constructor(private hcs:HolochainService) {  }

  get cell_agentKeyByteArray(){return this.hcs.agentKeyByteArray_from_cell};
  get cell_holoHashByteArray(){return this.hcs.HoloHashByteArray_from_cell}

  async getMyPublicKey(): Promise<string> {
    return this.hcs.call(this.zomeName,'who_am_i', null);
  }

  async getAgentBalance(agentPubKey: string): Promise<number> {
    return this.hcs.call(this.zomeName,'get_balance_for_agent', agentPubKey);
  }

  async getAgentTransactions(
    agentPubKey: string
  ): Promise<Array<Hashed<Transaction>>> {
  
    const transactions = await this.hcs.call(
      this.zomeName,'get_transactions_for_agent',
      agentPubKey
    );
    console.log("here")
    console.log(transactions)
    return transactions.map((t: any) => ({
      hash: t.hash,
      content: {
        ...t.content,
        timestamp: timestampToMillis(t.content.timestamp),
      },
    }));
  }

  async queryMyPendingOffers(): Promise<Array<Hashed<Offer>>> {
    return this.hcs.call(this.zomeName,'query_my_pending_offers', null);
  }

  async createOffer(recipientPubKey: string, amount: number): Promise<string> {
    return this.hcs.call(this.zomeName,'create_offer', {
      recipient_pub_key: recipientPubKey,
      amount,
    });
  }

  async acceptOffer(offerHash: string): Promise<string> {
    return this.hcs.call(this.zomeName,'accept_offer', offerHash);
  }
  /* 
  async cancelOffer(offerHash: string) {
    await this.callZome('cancel_offer', {
      offer_hash: offerHash,
    });
  }

  async rejectOffer(offerHash: string) {
    await this.callZome('reject_offer', {
      offer_hash: offerHash,
    });
  } */
}
