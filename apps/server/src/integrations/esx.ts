import { error } from "@zerio-voice/utils/logger";
import { ESXServer as Server } from "fivem-esx-js/server/esx_server";
import { ESXPlayer } from "fivem-esx-js/server/esx_xplayer";

const frameworkName =
  GetResourceKvpString("zerio-voice_customFrameworkName") ?? "es_extended";
export let ESX: Server | null = null;
let fetchAttempts = 0;

function tryFetchEsx() {
  emit("esx:getSharedObject", (obj: Server) => {
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

export function esxGetPlayerData(src: number): ESXPlayer | null {
  if (ESX) {
    return ESX.GetPlayerFromId(src);
  } else {
    return null;
  }
}

export function esxGetPlayerName(src: number): string {
  const plr = esxGetPlayerData(src);

  if (plr) {
    return plr.getName();
  }

  return GetPlayerName(src.toString());
}
