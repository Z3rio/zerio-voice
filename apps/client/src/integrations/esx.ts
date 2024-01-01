import { error } from "@zerio-voice/utils/logger";
import { ESXClient as Client } from "fivem-esx-js/client/esx_client";

export let ESX: Client | null = null;
let fetchAttempts = 0;

function tryFetchEsx() {
  emit("esx:getSharedObject", (obj: Client) => {
    ESX = obj;
  });

  fetchAttempts++;

  setTimeout(() => {
    if (!ESX && fetchAttempts <= 20) {
      tryFetchEsx();
    } else {
      error("Failed to fetch ESX");
    }
  }, 500);
}

try {
  if (
    global.exports["es_extended"] &&
    global.exports["es_extended"].getSharedObject
  ) {
    ESX = global.exports["es_extended"].getSharedObject();
  } else {
    tryFetchEsx();
  }
} catch (_e) {
  // could not load esx, probably doesnt exist on the server
}
