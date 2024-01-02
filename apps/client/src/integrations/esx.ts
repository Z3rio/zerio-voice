import { error } from "@zerio-voice/utils/logger";
import { ESXClient as Client } from "fivem-esx-js/client/esx_client";

const frameworkName = GetResourceKvpString("zerio-voice_customFrameworkName") ??
  "es_extended";
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
  const exps = global.exports[frameworkName];
  if (exps && exps.getSharedObject) {
    ESX = exps.getSharedObject();
  } else {
    tryFetchEsx();
  }
} catch (_e) {
  // could not load esx, probably doesnt exist on the server
}

export function esxNotify(text: string) {
  if (ESX) {
    ESX.ShowNotification(text);
  }
}
