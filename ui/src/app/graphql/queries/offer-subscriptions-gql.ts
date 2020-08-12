import {Injectable} from '@angular/core';
import {Subscription} from 'apollo-angular';
import gql from 'graphql-tag';



@Injectable({
  providedIn: 'root',
})
export class ReceivedOffersGQL extends Subscription {
  document = gql`
    subscription newOffer {
      offerReceived {
        id
      }
    }
  `;
}