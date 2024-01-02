import { Player, Server } from "@zerio2/qbcore.js";

const frameworkName =
  GetResourceKvpString("zerio-voice_customFrameworkName") ?? "qb-core";
export let QBCore: Server | null = null;

try {
  const exps = global.exports[frameworkName];

  if (exps && exps.GetCoreObject) {
    QBCore = exps.GetCoreObject();
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
