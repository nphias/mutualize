# Public Mutual-Credit Transactor

> Please note: this project is in its very early stages, not production ready nor feature complete nor secure. Expect breaking changes.

This module is designed to be included in other DNAs, assuming as little as possible from those. It is packaged as a holochain zome, and an npm package that offers native Web Components that can be used across browsers and frameworks.

Watch the (temporary) [Demo](https://www.youtube.com/watch?v=EcsBTIxUA0o).

## Dependencies

- [Profiles zome](https://github.com/holochain-open-dev/profiles)

## Documentation

See our [`storybook`](https://llavors-mutues.github.io/public-transactor).

## Installation and usage

### Including the zome in your DNA

1. Create a new folder in the `zomes` of the consuming DNA, with the name you want to give to this zome in your DNA.
2. Add a new `Cargo.toml` in that folder. In its content, paste the `Cargo.toml` content from any zome.
3. Change the `name` properties of the `Cargo.toml` file to the name you want to give to this zome in your DNA.
4. Add this zome as a dependency in the `Cargo.toml` file:

```toml
[dependencies]
transactor = {git = "https://github.com/llavors-mutues/public-transactor", package = "transactor"}
```

5. Create a `src` folder besides the `Cargo.toml` with this content:

```rust
extern crate transactor;
```

6. Add the zome into your `*.dna.workdir/dna.json` file.
7. Compile the DNA with the usual `CARGO_TARGET=target cargo build --release --target wasm32-unknown-unknown`.

### Using the UI module

1. Install the module with `npm install https://github.com/llavors-mutues/public-transactor#ui-build`.

2. Import and create the mobx store for profiles and for this module, and define the custom elements you need in your app:

```js
import {
  CreateOffer,
  MyOffers,
  PendingOfferList,
  MyBalance,
  PublicTransactorService,
  TransactorStore,
} from "@llavors-mutues/public-transactor";
import { connectStore } from "@holochain-open-dev/common";
import {
  ProfilePrompt,
  ProfilesStore,
  ProfilesService,
} from "@holochain-open-dev/profiles";
import { AppWebsocket } from "@holochain/conductor-api";

async function setupTransactor() {
  const appWebsocket = await ConductorApi.AppWebsocket.connect(
    process.env.CONDUCTOR_URL,
    12000
  );
  const appInfo = await appWebsocket.appInfo({
    installed_app_id: "test-app",
  });

  const cellId = appInfo.cell_data[0][0];

  const profilesService = new ProfilesService(appWebsocket, cellId);
  const profilesStore = new ProfilesStore(profilesService);
  const service = new PublicTransactorService(appWebsocket, cellId);
  const store = new TransactorStore(service, profilesStore);

  customElements.define(
    "profile-prompt",
    connectStore(ProfilePrompt, profilesStore)
  );
  customElements.define("create-offer", connectStore(CreateOffer, store));
  customElements.define("my-offers", connectStore(MyOffers, store));
  customElements.define("my-balance", connectStore(MyBalance, store));
}
```

3. All the elements you have defined are now available to use as normal HTML tags:

```html
...
<body>
  <create-offer style="height: 400px; width: 500px"></create-offer>
</body>
```

Take into account that at this point the elements already expect a holochain conductor running at `ws://localhost:8888`.

You can see a full working example [here](/ui/demo/index.html).

## Developer Setup

See our [developer setup guide](/dev-setup.md).