import { RadioMember } from "@zerio-voice/utils/structs";
import { info } from "@zerio-voice/utils/logger";
import { getTranslation } from "@zerio-voice/utils/translations";

const gameName = GetGameName();
const radioEnabled = GetResourceKvpInt("zerio-voice_enableRadio") === 1;
const keybind = GetResourceKvpString("zerio-voice_radioKeybind");
const radioData: Record<number, Array<RadioMember>> = {};
const playerServerId = GetPlayerServerId(PlayerId());
let currentRadioFreq: null | number = null;

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

function changeCurrentRadioFreq(frequency?: number | null) {
  if (!frequency) {
    return;
  }

  if (radioData[frequency]) {
    currentRadioFreq = frequency;
  }
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

// player just joined channel
onNet(
  "zerio-voice:client:syncRawPlayers",
  (freq: number, players: Array<RadioMember>) => {
    radioData[freq] = players;

    if (currentRadioFreq == null) {
      currentRadioFreq = freq;
    }
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
    if (src === playerServerId) {
      delete radioData[freq];

      const keys = Object.keys(radioData);

      if (keys.length === 0) {
        currentRadioFreq = null;
      } else {
        if (currentRadioFreq == freq) {
          currentRadioFreq = Number(keys[0]);
        }
      }
    } else {
      let newList = radioData[freq];

      if (newList) {
        newList = newList.filter((p) => p.source !== src);

        radioData[freq] = newList;
      }
    }
  },
);

const debug = false;

if (debug) {
  setInterval(() => {
    info("----------");
    info("localstate radioChannels", LocalPlayer.state.radioChannels);
    info("radioData", radioData);
    info("currentRadioFreq", currentRadioFreq);
  }, 1000);

  RegisterCommand(
    "addRadioChannel",
    (_src: number, args: Array<string>, _raw: string) => {
      addRadioChannel(Number(args[0]));
    },
    false,
  );

  RegisterCommand(
    "chooseRadioFreq",
    (_src: number, args: Array<string>, _raw: string) => {
      changeCurrentRadioFreq(Number(args[0]));
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
