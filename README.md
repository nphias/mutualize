# Mutualize

Mutualize is a mutual credit app that lets you create you own assets and exchange credits with others on the network
comprising of the following zomes
1. transactor for mutual credit  Design: https://hackmd.io/X9KFfDJZRS2vL9uLOq1oAg
2. profiles for registration


## Getting started holochain conductor


1. Make sure you've installed the Nix package manager on your computer. Follow the instructions for your operating system at the [Holochain developer portal](https://developer.holochain.org/docs/install/).

2. Clone or download this project onto your computer.

3. In a terminal window, enter the project's directory and enter the command:
    ```
    $ nix-shell
    ```
    This will set up the Holochain development environment with all the tools necessary to build the H-Wiki DNA and run an instance of it.

4. Compile your DNA:
    ```
    $ hc package
    ```
    This might take a while...

5. Run an instance of your DNA, using the supplied conductor configuration and agent key:
    ```
    $ holochain -c conductor-config.toml
    ```
    The agent keys and their hashes are included.


    If you get an error message like this:

    ```
    Error while trying to boot from config: ErrorGeneric("Error while trying to create instance \"x\": Provided DNA hash does not match actual DNA hash! QmT5PKN2xq5QjgsrbpmLopkpEZnwoKJnuuYrH8bpgBZEFX != QmeXZXx8RHV7qV9cXpaYoXYj13kHEvxvNoT1Aa2T3kNs64")
    ```

    It means that your DNA has compiled to a slightly different hash than expected. (This can happen if an upstream library has been updated.) You can fix this by running the command:

    ```
    $ hc hash
    ```

    then editing the `conductor-config.toml`:

    1. Find the section labeled `[[dnas]]`.
    2. Replace the value of `hash` with the value reported by `hc hash`.

## Running the user interface

1. enter the UI directory
2. type command: npm install (yarn can also be used)
3. type command: npm start (yarn can also be used)

## Next steps

* **Test with 2 players.** This takes a little more resources with two conductors

    you will need 5 terminal tabs with 3 in nix-shell
    1. sim2h server (nix-shell) cmd: sim2h_server
    2. conductor1 (nix-shell) cmd: holochain -c conductor-config.toml
    3. conductor2 (nixshell) cmd: holochain -c conductor-config2.toml
    4. UI1 cmd: npm start (inside UI dir)
    5. UI2 cmd: npm run start2 (inside UI dir)

* **Collaborate with friends.** This takes a little extra configuration and works best on a LAN.

    1. On the first participant's machine, follow the instructions above to get the sim2h server and first conductor running with `conductor-config.toml`. Take note of the first participant's IP address.
    2. On the second participant's machine, edit the `conductor-config2.toml` file:

        - Look for the `[network]` section and change the hostname in the value of `sim2h_url` to the first participant's machine's IP address.

    3. Start up the conductor on the second participant's machine `conductor-config2.toml` _without_ first starting up the sim2h server. Because both participants are using the sim2h server on the first machine, they'll be able to talk to each other.

    4. on the first machine in UI: npm start
    5. on the second machine in UI: npm run start2 

* **Persist the data.** Currently the conductor config is set up to use an in-memory store. Once all agents stop their running instances, the data will disappear. To play around with a permanent DHT, each agent should change their `conductor-config.toml` file to persist their source chain and DHT shard to device storage:

    1. Create a persistence directory called `persistence_store` in the project directory (normally you would put it in a more permanent spot, but this will be fine for testing).

    2. Find the section labeled `[instances.storage]`.

    3. Change the `type` to `'file'`.

    4. Add a line to specify the path to persist data to:

        ```
        path = 'persistence_store'
        ```

## Testing

Run this command to run the tests (right now only minimal tests):

```
hc test
```

## Building

To rebuild the DNA that holochain uses to run use the `hc` command:

```
hc package
```

If you're using the sample `conductor-config.toml` file, as in the above instructions, edit it and replace the old DNA hash with the new one that `hc package` reports.

Stop the running conductor (ctrl + c) and rerun the above again if you make changes to the DNA.

## Updating to new holochain version

To update the holonix version (and therefore the holochain binaries) edit the holonix property of `config.nix`.
