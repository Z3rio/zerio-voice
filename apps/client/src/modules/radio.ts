import { getTranslation } from "@zerio-voice/utils/translations";

const gameName = GetGameName();
const radioEnabled = GetResourceKvpInt("zerio-voice_enableRadio") === 1;
const keybind = GetResourceKvpString("zerio-voice_radioKeybind");

function radioToggle(toggle: boolean): void {
  if (!radioEnabled) {
    return;
  }
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
    keybind,
  );
} else if (gameName == "redm") {
  // todo: fix key handling for redm
}
