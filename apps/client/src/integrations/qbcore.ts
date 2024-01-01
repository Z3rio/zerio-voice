import { Client } from "@zerio2/qbcore.js";

export let QBCore: Client | null = null;

try {
  if (global.exports["qb-core"] && global.exports["qb-core"].getCoreObject) {
    QBCore = global.exports["qb-core"].getCoreObject();
  }
} catch (_e) {
  // could not load qbcore, probably doesnt exist on the server
}
