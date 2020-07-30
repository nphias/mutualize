import { environment } from '@environment';
import {GraphQLError} from 'graphql'

const ZOME_NAME = "transactor"
const INSTANCE_NAME = environment.INSTANCE_NAME

function offerToTransaction(id, offer) {
  const state = offer.state;
  return {
    id,
    transaction: {
      id,
      ...offer.transaction,
    },
    state: typeof state === 'object' ? Object.keys(state)[0] : state,
  };
}

export const resolvers_transactor = {
  Transaction: {
    creditor(parent) {
      return { id: parent.creditor_address };
    },
    debtor(parent) {
      return { id: parent.debtor_address };
    },
  },
  Offer: {
    async counterparty(parent, _, connection) {

      try {
        const snapshot = await connection.call(INSTANCE_NAME, ZOME_NAME, 'get_counterparty_snapshot',
          {
            transaction_address: parent.id,
          }
        );
        return {
          online: true,
          consented: true,
          snapshot,
        };
      } catch (e) {
        if (e.message.includes('Offer is not pending')) {
          return {
            online: true,
            consented: false,
            snapshot: null,
          };
        } else if (e.message.includes('Counterparty is offline')) {
          return {
            online: false,
            consented: null,
            snapshot: null,
          };
        }
      }
    },
  },
  CounterpartySnapshot: {
    lastHeaderId(parent) {
      return parent.last_header_address;
    },
    invalidReason(parent) {
      return parent.invalid_reason;
    },
  },
  Query: {
    async offer(_, { transactionId }, connection) {

      const offer = await connection.call(INSTANCE_NAME,ZOME_NAME,'query_offer', {
        transaction_address: transactionId,
      });
      return offerToTransaction(transactionId, offer);
    },
    async transactions(_, __, connection) {
      if (connection.state == 2)
      return new GraphQLError("Holochain is disconnected")
      const transactions = await connection.call(INSTANCE_NAME, ZOME_NAME,
        'query_my_transactions',
        {}
      );
      return transactions.map((t) => ({ id: t[0], ...t[1] }));
    },
    async offers(_, __, connection) {
      const offers = await connection.call(INSTANCE_NAME, ZOME_NAME,'query_my_offers', {});
      console.log(offers);
      return offers.map((offer) => offerToTransaction(offer[0], offer[1]));
    },
    async balance(_, __, connection) {
      const result = await connection.call(INSTANCE_NAME, ZOME_NAME, 'query_my_balance', {});
      return result.hasOwnProperty('Ok') ? result.Ok : result;
    },
  },
  Mutation: {
    async createOffer(_, { creditorId, amount }, connection) {

      return connection.call(INSTANCE_NAME, ZOME_NAME, 'create_offer', {
        creditor_address: creditorId,
        amount,
        timestamp: Math.floor(Date.now() / 1000),
      });
    },
    async acceptOffer(_, { transactionId, approvedHeaderId }, connection) {

      await connection.call(INSTANCE_NAME, ZOME_NAME, 'accept_offer', {
        transaction_address: transactionId,
        approved_header_address: approvedHeaderId,
      });

      return transactionId;
    },
    async consentForOffer(_, { transactionId }, connection) {

      await connection.call(INSTANCE_NAME, ZOME_NAME, 'consent_for_offer', {
        transaction_address: transactionId,
      });

      return transactionId;
    },
    async cancelOffer(_, { transactionId }, connection) {

      await connection.call(INSTANCE_NAME, ZOME_NAME, 'cancel_offer', {
        transaction_address: transactionId,
      });

      return transactionId;
    },
  },
};
