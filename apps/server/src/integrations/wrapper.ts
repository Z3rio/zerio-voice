import { getFramework } from "@zerio-voice/utils/functions";
import { Framework } from "@zerio-voice/utils/structs";
import { vrpGetPlayerName } from "./vrp";
import { qbGetPlayerName } from "./qbcore";
import { esxGetPlayerName } from "./esx";

const framework = getFramework();

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
