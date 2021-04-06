# Mutualize

Mutualize is a mutual credit app that lets you create you own assets and exchange credits with others on the network
comprising of the following zomes
1. transactor for mutual credit  Design: https://hackmd.io/X9KFfDJZRS2vL9uLOq1oAg?view
2. profiles for registration


## UI setup

cd ui
npm install

# development/ debug

npm start  - needs holochain
npm run mock - sample data

# production

npm run buildproduction
npm run web

## holochain setup

clone and run the public-transactor
see [here](https://github.com/llavors-mutues/public-transactor)


1. install nix (dont install holochain)
2. in the directory where the default.nix file resides type nix-shell (this will install the appropriate version of holochain for you)
3. cd zome
4. run the following build commands:
    CARGO_TARGET_DIR=target cargo build --release --target wasm32-unknown-unknown
    hc dna pack workdir/dna
    hc app pack workdir/happ
5. start the conductor on a port with bootstrap:
    hc s generate workdir/happ/transactor-happ.happ -r=8888 network -b https://bootstrap-staging.holo.host quic
6. optionally in another terminal start another conductor (different port) for two player action:
    hc s generate workdir/happ/transactor-happ.happ -r=8889 network -b https://bootstrap-staging.holo.host quic