import {
  Orchestrator,
  Config,
  InstallAgentsHapps,
  TransportConfigType,
  Player,
} from "@holochain/tryorama";
import path from "path";

const conductorConfig = Config.gen({});

// Construct proper paths for your DNAs
const dna = path.join(__dirname, "../transactor.dna.gz");

const sleep = (ms) => new Promise((resolve) => setTimeout(() => resolve(), ms));

const orchestrator = new Orchestrator();

// create an InstallAgentsHapps array with your DNAs to tell tryorama what
// to install into the conductor.
const installation: InstallAgentsHapps = [
  // agent 0
  [
    // happ 0
    [dna],
  ],
  [
    // happ 0
    [dna],
  ],
];

const dateToTimestamp = (date) => [
  Math.floor(date / 1000),
  (date % 1000) * 1000,
];

orchestrator.registerScenario(
  "create and get transactions",
  async (s, t) => {
    const [player]: Player[] = await s.players([conductorConfig]);
    const [[alice_happ], [bob_happ]] = await player.installAgentsHapps(
      installation
    );

    const alice_dna = alice_happ.cells[0];
    const bob_dna = bob_happ.cells[0];

    let who_am_i = await alice_dna.call(
      "transactor",
      "who_am_i",
      null
    );
    t.ok(who_am_i);


    /*let transactions = await alice_dna.call(
      "transactor",
      "get_transactions_for_agent",
      {who_am_i}
      
    );
    t.ok(transactions);*/

    await sleep(10);



  }
);

orchestrator.run();
