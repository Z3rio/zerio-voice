import { getTranslation } from "@zerio-voice/utils/translations";

const gameName = GetGameName();
const radioEnabled = GetResourceKvpInt("zerio-voice_enableRadio") === 1;

function radioToggle(toggle: boolean): void {
  if (!radioEnabled) {
    return;
  }

  console.log("radio toggled", toggle);
}

if (gameName == "fivem") {
  RegisterCommand(
    "+radio",
    () => {
      radioToggle(true);
    },
    false,
  );

  RegisterCommand(
    "-radio",
    () => {
      radioToggle(false);
    },
    false,
  );

  RegisterKeyMapping(
    "+radio",
    getTranslation(["radio", "keybind"]),
    "keyboard",
    "CAPITAL",
  );
} else if (gameName == "redm") {
  // todo: fix key handling for redm
}
