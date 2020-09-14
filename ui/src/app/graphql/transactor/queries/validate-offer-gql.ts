import {Injectable} from '@angular/core';
import {Query} from 'apollo-angular';
import gql from 'graphql-tag';

export interface Agent {
  id: string
  username: String
}

enum OfferState {
  Received,
  Pending,
  Canceled,
  Approved,
  Completed
}

export interface Transaction {
  id: string
  debtor: Agent
  creditor: Agent
  amount: number
  timestamp: Date
}
export interface CounterpartySnapshot {
  executable: boolean
  balance: number
  invalidReason: string
  valid: boolean
  lastHeaderId: string
}

export interface Counterparty {
  online: boolean
  consented: boolean
  snapshot: CounterpartySnapshot
}

export interface Offer {
  id: string
  transaction: Transaction
  counterparty: Counterparty
  state: OfferState
}

export interface Response {
  offer: Offer
}

@Injectable({
  providedIn: 'root',
})
export class ValidateOfferGQL extends Query<Response> {
  document = gql`
  query GetOfferDetail($transactionId: String!) {

    offer(transactionId: $transactionId) {
      id
      transaction {
        id
        debtor {
          id
          username
        }
        creditor {
          id
          username
        }
        amount
        timestamp
      }

      counterparty {
        online
        consented
        snapshot {
          executable
          valid
          invalidReason
          balance
          lastHeaderId
        }
      }

      state
    }
  }
`;
}