import { RadioMember } from "@zerio-voice/utils/structs";
import { info } from "@zerio-voice/utils/logger";
import { getTranslation } from "@zerio-voice/utils/translations";
import { voiceTarget } from "@zerio-voice/utils/data";
import { RadioSubmix } from "./submix";

const gameName = GetGameName();
const radioEnabled = GetResourceKvpInt("zerio-voice_enableRadio") === 1;
const enableRadioSubmix =
  GetResourceKvpInt("zerio-voice_enableRadioSubmix") === 1;
const enableMicClicks =
  GetResourceKvpInt("zerio-voice_enableRadioMicClicks") === 1;
const micClicksVolume = GetResourceKvpFloat("zerio-voice_micClicksVolume");
const keybind = GetResourceKvpString("zerio-voice_radioKeybind");
const radioData: Record<number, Array<RadioMember>> = {};
const playerServerId = GetPlayerServerId(PlayerId());
let radioTalkingTick: number | null = null;

function playMicClicks(isTalking: boolean) {
  if (enableMicClicks) {
    SendNUIMessage({
      action: "playRadioMicClicks",
      data: {
        toggled: isTalking,
        volume: micClicksVolume,
      },
    });
  }
}

function handleVoiceTargets() {
  const radioFreq = LocalPlayer.state.currentRadioFreq;

  if (!radioFreq) {
    return;
  }

  const channelData = radioData[radioFreq];

  if (channelData) {
    for (let i = 0; i < channelData.length; i++) {
      const v = channelData[i];

      if (v && playerServerId !== v.source) {
        MumbleAddVoiceTargetPlayerByServerId(voiceTarget, v.source);
      }
    }
  }
}

function radioToggle(toggle: boolean): void {
  if (!radioEnabled) {
    return;
  }

  if (toggle) {
    if (!LocalPlayer.state.currentRadioFreq) {
      return;
    }

    handleVoiceTargets();
    playMicClicks(toggle);

    LocalPlayer.state.set("talkingOnRadio", true, true);
    emitNet("zerio-voice:server:setTalkingOnRadio", true);

    radioTalkingTick = setTick(() => {
      SetControlNormal(0, 249, 1.0);
      SetControlNormal(1, 249, 1.0);
      SetControlNormal(2, 249, 1.0);
    });
  } else {
    playMicClicks(toggle);

    LocalPlayer.state.set("talkingOnRadio", false, true);
    emitNet("zerio-voice:server:setTalkingOnRadio", false);

    MumbleClearVoiceTargetPlayers(voiceTarget);

    if (radioTalkingTick) {
      clearTick(radioTalkingTick);
      radioTalkingTick = null;
    }
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

function changeCurrentRadioFreq(frequency?: number | null) {
  if (frequency && radioData[frequency]) {
    LocalPlayer.state.set("currentRadioFreq", frequency, true);

    return true;
  }

  return false;
}
global.exports("changeCurrentRadioFreq", changeCurrentRadioFreq);

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
  "zerio-voice:client:setTalkingOnRadio",
  (freq: number, src: number, isTalking: boolean) => {
    const newData = radioData[freq];

    if (newData) {
      const newPlrIdx = newData.findIndex((p) => p.source === src);

      if (newPlrIdx !== -1) {
        const newPlrData = newData[newPlrIdx];

        if (newPlrData) {
          newPlrData.talking = isTalking;

          if (isTalking) {
            MumbleSetVolumeOverrideByServerId(src, 0.6);
          } else {
            MumbleSetVolumeOverrideByServerId(src, -1);
          }

          playMicClicks(isTalking);

          if (enableRadioSubmix) {
            if (isTalking) {
              RadioSubmix.enable();
            } else {
              RadioSubmix.disable();
            }
          }

          newData[newPlrIdx] = newPlrData;
          radioData[freq] = newData;
        }
      }
    }
  },
);

// player joined a new channel
onNet(
  "zerio-voice:client:syncRawPlayers",
  (freq: number, players: Array<RadioMember>) => {
    radioData[freq] = players;

    if (LocalPlayer.state.currentRadioFreq == null) {
      LocalPlayer.state.set("currentRadioFreq", freq, true);
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
        LocalPlayer.state.set("currentRadioFreq", null, true);
      } else {
        if (LocalPlayer.state.currentRadioFreq == freq) {
          LocalPlayer.state.set("currentRadioFreq", Number(keys[0]), true);
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

const debug = GetConvarInt("zerio_voice_debug", 0);

if (debug >= 1) {
  if (debug >= 2) {
    setInterval(() => {
      info("----------");
      info("localstate radioChannels", LocalPlayer.state.radioChannels);
      info("radioData", radioData);
      info("currentRadioFreq", LocalPlayer.state.currentRadioFreq);
    }, 2500);
  }

  RegisterCommand(
    "addRadioChannel",
    (_src: number, args: Array<string>, _raw: string) => {
      addRadioChannel(Number(args[0]));
    },
    false,
  );

  RegisterCommand(
    "changeRadioChannel",
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

const initialRadioFreq = LocalPlayer.state.currentRadioFreq;

if (initialRadioFreq) {
  addRadioChannel(initialRadioFreq);
}
