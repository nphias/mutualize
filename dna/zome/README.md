# Zome Developer Setup

This folder has an example DNA for the `transactor` zome. The actual code for the zome is in `zomes/transactor`.

To change the code, you can work either opening VSCode inside the root folder of the repo or in this folder, you should have rust intellisense either way.

## Requirements

- Having [`nix-shell` installed](https://developer.holochain.org/docs/install/).
- Have [`holochain-run-dna`](https://www.npmjs.com/package/@holochain-open-dev/holochain-run-dna) installed globally, and the `lair-keystore` described in its README as well.

## Building

```bash
CARGO_TARGET_DIR=target cargo build --release --target wasm32-unknown-unknown
dna-util -c transactor.dna.workdir/
```

## Testing

> Note: tests are not implemented yet.

After having built the DNA:

```bash
cd test
npm install
npm test
```

## Running

After having built the DNA:

```bash
holochain-run-dna transactor.dna.gz
```

Now `holochain` will be listening at port `8888`;

Restart the command if it fails (flaky holochain start).
