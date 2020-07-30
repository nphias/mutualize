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

@Injectable({
  providedIn: 'root',
})
export class ConsentOfferGQL extends Mutation {
  document = gql`
  mutation ConsentForOffer($transactionId: ID!) {
    consentForOffer(transactionId: $transactionId)
  }
`;
}

@Injectable({
  providedIn: 'root',
})
export class AcceptOfferGQL extends Mutation {
  document = gql`
  mutation AcceptOffer($transactionId: ID!, $approvedHeaderId: ID!) {
    acceptOffer(
      transactionId: $transactionId
      approvedHeaderId: $approvedHeaderId
    )
  }
`;
}

@Injectable({
  providedIn: 'root',
})
export class CancelOfferGQL extends Mutation {
  document = gql`
  mutation CancelOffer($transactionId: ID!) {
    cancelOffer(transactionId: $transactionId)
  }
`;
}