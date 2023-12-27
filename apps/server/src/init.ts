import { getConfig, success, validateConfig, warn } from "@zerio-voice/shared";

onNet("onResourceStart", (resName: string) => {
  if (GetCurrentResourceName() == resName) {
    const cfg = getConfig();

    if (!validateConfig(cfg)) {
      warn("Your config seems to be invalid");
    } else {
      success("Your config seems to be valid");
    }
  }
});
