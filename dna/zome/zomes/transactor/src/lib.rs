use hc_utils::WrappedAgentPubKey;
use hdk3::prelude::*;

mod offer;
mod signals;
mod transaction;
mod utils;

pub fn err(reason: &str) -> WasmError {
    WasmError::Zome(String::from(reason))
}

pub fn defs() -> EntryDefs {
    vec![
        Path::entry_def(),
        offer::Offer::entry_def(),
        transaction::Transaction::entry_def(),
    ]
    .into()
}

#[hdk_extern]
fn entry_defs(_: ()) -> ExternResult<EntryDefsCallbackResult> {
    Ok(EntryDefsCallbackResult::Defs(defs()))
}

#[hdk_extern]
pub fn who_am_i(_: ()) -> ExternResult<WrappedAgentPubKey> {
    let info = agent_info()?;
    Ok(WrappedAgentPubKey(info.agent_latest_pubkey))
}

#[hdk_extern]
pub fn init(_: ()) -> ExternResult<InitCallbackResult> {
    let mut functions = GrantedFunctions::new();
    functions.insert((zome_info()?.zome_name, "receive_offer".into()));

    let grant = ZomeCallCapGrant {
        access: CapAccess::Unrestricted,
        functions,
        tag: "".into(),
    };
    create_cap_grant(grant)?;

    functions = GrantedFunctions::new();
    functions.insert((zome_info()?.zome_name, "notify_accepted_offer".into()));

    let grant2 = ZomeCallCapGrant {
        access: CapAccess::Unrestricted,
        functions,
        tag: "".into(),
    };
    create_cap_grant(grant2)?;

    Ok(InitCallbackResult::Pass)
}
