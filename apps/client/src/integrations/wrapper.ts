import { getConfig } from "@zerio-voice/utils/config";
import { getFramework } from "@zerio-voice/utils/functions";
import { Framework } from "@zerio-voice/utils/structs";
import { qbNotify } from "./qbcore";
import { esxNotify } from "./esx";

const cfg = getConfig();
const framework = getFramework();

if (cfg && cfg.framework.customResourceName) {
  SetResourceKvp(
    "zerio-voice_customFrameworkName",
    cfg.framework.customResourceName
  );
}

export function notify(text: string) {
  switch (framework) {
    case Framework.QBCore:
      qbNotify(text);
      break;
    case Framework.ESX:
      esxNotify(text);
      break;
    default:
      SetNotificationTextEntry("STRING");
      AddTextComponentString(text);
      DrawNotification(false, false);
      break;
  }
}
