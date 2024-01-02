import { getConfig } from "@zerio-voice/utils/config";

const cfg = getConfig();

if (cfg && cfg.framework.customResourceName) {
  SetResourceKvp(
    "zerio-voice_customFrameworkName",
    cfg.framework.customResourceName
  );
}
