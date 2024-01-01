import { error } from "@zerio-voice/utils/logger";
import { ESXServer as Server } from "fivem-esx-js/server/esx_server";
import { ESXPlayer } from "fivem-esx-js/server/esx_xplayer";

let ESX: Server | null = null;
try {
  if (
    global.exports["es_extended"] &&
    global.exports["es_extended"].getSharedObject
  ) {
    ESX = global.exports["es_extended"].getSharedObject();
  } else {
    let attempts = 0;
    function tryFetchEsx() {
      emit("esx:getSharedObject", (obj: Server) => {
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
} catch (_e) {}

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
