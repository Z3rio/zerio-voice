import { getTranslation } from "@zerio-voice/utils/translations";

const gameName = GetGameName();
const radioEnabled = GetResourceKvpInt("zerio-voice_enableRadio") === 1;
const keybind = GetResourceKvpString("zerio-voice_radioKeybind");
const radioData: Record<number, Record<number, boolean>> = {};

function radioToggle(toggle: boolean): void {
  if (!radioEnabled) {
    return;
  }
}

function addRadioChannel(frequency: number) {
  if (!radioEnabled) {
    return false;
  }

  emitNet("zerio-voice:server:addPlayerToRadioChannel", frequency);

  return true;
}

global.exports("addRadioChannel", addRadioChannel);

function removeRadioChannel(frequency: number) {
  if (!radioEnabled) {
    return false;
  }

  emitNet("zerio-voice:server:removePlayerFromRadioChannel", frequency);

  return true;
}

global.exports("removeRadioChannel", removeRadioChannel);

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

const debug = false;

if (debug) {
  setInterval(() => {
    console.log(LocalPlayer.state.radioChannels);
  }, 1000);

  RegisterCommand(
    "addRadioChannel",
    (_src: number, args: string[], _raw: string) => {
      addRadioChannel(Number(args[0]));
    },
    false,
  );

  RegisterCommand(
    "removeRadioChannel",
    (_src: number, args: string[], _raw: string) => {
      removeRadioChannel(Number(args[0]));
    },
    false,
  );
}
