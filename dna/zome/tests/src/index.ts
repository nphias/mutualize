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
const calendarEvents = path.join(__dirname, "../../transactor.dna.gz");

const sleep = (ms) => new Promise((resolve) => setTimeout(() => resolve(), ms));

const orchestrator = new Orchestrator();

// create an InstallAgentsHapps array with your DNAs to tell tryorama what
// to install into the conductor.
const installation: InstallAgentsHapps = [
  // agent 0
  [
    // happ 0
    [calendarEvents],
  ],
  [
    // happ 0
    [calendarEvents],
  ],
];

const dateToTimestamp = (date) => [
  Math.floor(date / 1000),
  (date % 1000) * 1000,
];

orchestrator.registerScenario(
  "create and get a calendar event",
  async (s, t) => {
    const [player]: Player[] = await s.players([conductorConfig]);
    const [[alice_happ], [bob_happ]] = await player.installAgentsHapps(
      installation
    );

    const alice_calendar = alice_happ.cells[0];
    const bob_calendar = bob_happ.cells[0];

    let offers = await alice_calendar.call(
      "transactor",
      "query_my_pending_offers",
      null
    );
    t.equal(offers.length, 0);

    await sleep(10);
  }
);

orchestrator.run();
