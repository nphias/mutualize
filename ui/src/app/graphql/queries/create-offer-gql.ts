import {Injectable} from '@angular/core';
import {Mutation} from 'apollo-angular';
import gql from 'graphql-tag';

@Injectable({
  providedIn: 'root',
})
export class CreateOfferGQL extends Mutation {
  document = gql`
    mutation CreateOffer($creditorId: ID!, $amount: Float!) {
      createOffer(creditorId: $creditorId, amount: $amount)
    }
  `;
}