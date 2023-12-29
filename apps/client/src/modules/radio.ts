import { RadioMember } from "@zerio-voice/utils/structs";
import { getTranslation } from "@zerio-voice/utils/translations";

const gameName = GetGameName();
const radioEnabled = GetResourceKvpInt("zerio-voice_enableRadio") === 1;
const keybind = GetResourceKvpString("zerio-voice_radioKeybind");
const radioData: Record<number, Array<RadioMember>> = {};

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

onNet(
  "zerio-voice:client:syncRawPlayers",
  (freq: number, players: Array<RadioMember>) => {
    radioData[freq] = players;
  },
);

onNet(
  "zerio-voice:client:playerAddedToRadioChannel",
  (freq: number, src: number, name: string) => {
    const newList = radioData[freq];

    if (newList) {
      newList.push({
        talking: false,
        name: name,
        source: src,
      });

      radioData[freq] = newList;
    }
  },
);

onNet(
  "zerio-voice:client:playerRemovedFromRadioChannel",
  (freq: number, src: number) => {
    let newList = radioData[freq];

    if (newList) {
      newList = newList.filter((p) => p.source !== src);

      radioData[freq] = newList;
    }
  },
);

const debug = true;

if (debug) {
  setInterval(() => {
    console.log("localstate radioChannels", LocalPlayer.state.radioChannels);
    console.log("radioData", radioData);
  }, 1000);

  RegisterCommand(
    "addRadioChannel",
    (_src: number, args: Array<string>, _raw: string) => {
      addRadioChannel(Number(args[0]));
    },
    false,
  );

  RegisterCommand(
    "removeRadioChannel",
    (_src: number, args: Array<string>, _raw: string) => {
      removeRadioChannel(Number(args[0]));
    },
    false,
  );
}
