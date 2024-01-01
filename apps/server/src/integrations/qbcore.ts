import { Player, Server } from "@zerio2/qbcore.js";

export let QBCore: Server | null = null;
try {
  if (global.exports["qb-core"] && global.exports["qb-core"].GetCoreObject) {
    QBCore = global.exports["qb-core"].GetCoreObject();
  }
} catch (_e) {
  // could not load qbcore, probably doesnt exist on the server
}

export function qbGetPlayerData(src: number): Player | null {
  if (QBCore) {
    return QBCore.Functions.GetPlayer(src);
  } else {
    return null;
  }
}

export function qbGetPlayerName(src: number): string {
  const plr = qbGetPlayerData(src);

  if (plr) {
    return (
      plr.PlayerData.charinfo.firstname + " " + plr.PlayerData.charinfo.lastname
    );
  }

  return GetPlayerName(src.toString());
}
