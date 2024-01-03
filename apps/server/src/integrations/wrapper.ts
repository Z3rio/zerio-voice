import { getFramework } from "@zerio-voice/utils/functions";
import { Framework } from "@zerio-voice/utils/structs";
import { vrpGetPlayerName } from "./vrp";
import { qbGetPlayerName } from "./qbcore";
import { esxGetPlayerName } from "./esx";
import { getConfig } from "@zerio-voice/utils/config";

const framework = getFramework();
const cfg = getConfig();

if (cfg && cfg.framework.customResourceName) {
  SetResourceKvp(
    "zerio-voice_customFrameworkName",
    cfg.framework.customResourceName
  );
}

export async function getPlayerName(src: number): Promise<string> {
  switch (framework) {
    case Framework.QBCore:
      return qbGetPlayerName(src);
    case Framework.vRP:
      return await vrpGetPlayerName(src);
    case Framework.ESX:
      return esxGetPlayerName(src);
    default:
      return GetPlayerName(src.toString());
  }
}

export async function notify(src: number, text: string) {
  emitNet("zerio-voice:client:notify", src, text);
}
