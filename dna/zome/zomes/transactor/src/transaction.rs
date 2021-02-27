use hc_utils::{WrappedAgentPubKey, WrappedEntryHash};
use hdk3::prelude::timestamp::Timestamp;
use hdk3::prelude::*;

use crate::{
    offer::Offer,
    utils::{self, Hashed},
};

#[hdk_entry(id = "transaction", visibility = "public")]
#[derive(Clone)]
pub struct Transaction {
    spender_pub_key: WrappedAgentPubKey,
    recipient_pub_key: WrappedAgentPubKey,
    offer_hash: WrappedEntryHash,
    amount: f64,
    timestamp: Timestamp,
}

pub fn create_transaction_for_offer(offer: Offer) -> ExternResult<Hashed<Transaction>> {
    let time = sys_time()?;
    let transaction = Transaction {
        spender_pub_key: offer.spender_pub_key.clone(),
        recipient_pub_key: offer.recipient_pub_key.clone(),
        amount: offer.amount,
        offer_hash: WrappedEntryHash(hash_entry(&offer)?),
        timestamp: Timestamp(time.as_secs() as i64, time.subsec_nanos()),
    };

    let spender_pub_key = offer.spender_pub_key.0;
    let recipient_pub_key = offer.recipient_pub_key.0;

    create_entry(&transaction)?;

    let transaction_hash = hash_entry(&transaction)?;

    create_link(spender_pub_key.into(), transaction_hash.clone(), ())?;
    create_link(recipient_pub_key.into(), transaction_hash.clone(), ())?;

    Ok(Hashed {
        hash: WrappedEntryHash(transaction_hash),
        content: transaction,
    })
}

#[hdk_extern]
pub fn get_transactions_for_agent(
    agent_pub_key: WrappedAgentPubKey,
) -> ExternResult<Vec<Hashed<Transaction>>> {
    let links = get_links(agent_pub_key.0.into(), None)?;

    let transactions: Vec<Hashed<Transaction>> = links
        .into_inner()
        .iter()
        .map(|link| {
            let transaction: Transaction = utils::try_get_and_convert(link.target.clone())?;
            Ok(Hashed {
                hash: WrappedEntryHash(link.target.clone()),
                content: transaction,
            })
        })
        .collect::<ExternResult<Vec<Hashed<Transaction>>>>()?;

    Ok(transactions)
}
