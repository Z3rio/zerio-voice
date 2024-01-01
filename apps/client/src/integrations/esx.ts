import { error } from "@zerio-voice/utils/logger";
import { ESXClient as Client } from "fivem-esx-js/client/esx_client";

let ESX: Client | null = null;
if (
  global.exports["es_extended"] &&
  global.exports["es_extended"].getSharedObject
) {
  ESX = global.exports["es_extended"].getSharedObject();
} else {
  let attempts = 0;
  function tryFetchEsx() {
    emit("esx:getSharedObject", (obj: Client) => {
      ESX = obj;
    });

    attempts++;

    setTimeout(() => {
      if (!ESX && attempts <= 20) {
        tryFetchEsx();
      } else {
        error("Failed to fetch ESX");
      }
    }, 500);
  }

  tryFetchEsx();
}
