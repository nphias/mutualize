import {Injectable} from '@angular/core';
import {Query} from 'apollo-angular';
import gql from 'graphql-tag';

export interface Agent {
  id: string
  username: String
}

export interface Transaction {
  id: string
  debtor: Agent
  creditor: Agent
  amount: number
  timestamp: number
}

export interface Response {
  transactions: [Transaction];
}

@Injectable({
  providedIn: 'root',
})
export class MyTransactionsGQL extends Query<Response> {
  document = gql`
  query GetMyTransactions {
    transactions {
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
  }
`;
}