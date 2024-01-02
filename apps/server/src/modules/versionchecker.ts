import { error, success, warn } from "@zerio-voice/utils/logger";
import axios from "axios";

async function initialize() {
  const currVersion = GetResourceMetadata(
    GetCurrentResourceName(),
    "version",
    0
  );

  if (!currVersion) {
    warn("Could not find the local script version");
    return;
  }

  try {
    const resp = await axios.get(
      "https://raw.githubusercontent.com/Z3rio/zerio-voice/main/fxmanifest.lua"
    );

    if (resp.status === 200) {
      const globalVersion = getVersionFromFxmanifest(resp.data);

      if (globalVersion !== null && currVersion == globalVersion) {
        success("The script is up to date");
      } else {
        error(
          `The script has updated. You are on version ${currVersion}, the newest version is ${globalVersion}`
        );
      }
    }
  } catch (e) {
    warn("Failed to fetch the global script version, error:");
    warn(e);
  }
}

function getVersionFromFxmanifest(fxmanifest: string): string | null {
  const lines = fxmanifest
    .split(/\r?\n|\r|\n/g)
    .filter(
      (line: string) => !line.includes("fx_") && line.includes("version")
    );

  if (lines[0]) {
    return lines[0].replace("version", "").replace(/'|"|\(|\)/g, "");
  } else {
    return null;
  }
}

initialize();
