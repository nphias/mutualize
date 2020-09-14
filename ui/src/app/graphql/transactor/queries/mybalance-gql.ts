import {Injectable} from '@angular/core';
import {Query} from 'apollo-angular';
import gql from 'graphql-tag';

  
export interface Response {
  balance: number
}

@Injectable({
    providedIn: 'root',
  })
  export class MyBalanceGQL extends Query<Response> {
    document = gql`
    query myBalance {
        balance
    }
  `;
  }