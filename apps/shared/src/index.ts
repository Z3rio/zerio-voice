import { getConfig, success, validateConfig } from "@zerio-voice/utils";
import { warn } from "console";

setImmediate(() => {
  const cfg = getConfig();

  if (cfg) {
    if (!validateConfig(cfg)) {
      warn("Your config seems to be invalid");
    } else {
      SetResourceKvp("zerio-voice_logLevel", cfg.logLevel);

      success("Your config seems to be valid");
    }
  }
});
