import { Client } from "@zerio2/qbcore.js";

let QBCore: Client | null = null;
if (global.exports["qb-core"] && global.exports["qb-core"].getCoreObject) {
  QBCore = global.exports["qb-core"].getCoreObject();
}
