import { getConfig } from "@zerio-voice/utils/config";
import { PlayerRadioData, RadioChannelData } from "../classes/radioData";
import { info } from "@zerio-voice/utils/logger";
import { RadioSafeGuard } from "@zerio-voice/utils/structs";

let radioEnabled = true;
const playerData: Record<number, PlayerRadioData> = {};
const channelData: Record<number, RadioChannelData> = {};

function initialize() {
  const cfg = getConfig();

  if (cfg) {
    radioEnabled = cfg.radio.enabled;
  }

  const plrs = getPlayers();

  for (let i = 0; i < plrs.length; i++) {
    const src = Number(plrs[i]);

    if (src) {
      handleNewPlayer(src);
    }
  }
}

async function addPlayerToRadioChannel(
  src: number,
  frequency: number
): Promise<boolean> {
  if (!radioEnabled || frequency <= 0) {
    return false;
  }

  if (!channelData[frequency]) {
    channelData[frequency] = new RadioChannelData(frequency);
  }

  if (!playerData[src]) {
    handleNewPlayer(src);
  }

  const channel = channelData[frequency];
  const player = playerData[src];

  if (channel && player) {
    const retVal = await channel.addPlr(src);

    if (retVal) {
      player.addChannel(frequency);

      return true;
    }
  }

  return false;
}
global.exports("addPlayerToRadioChannel", addPlayerToRadioChannel);

onNet("zerio-voice:server:addPlayerToRadioChannel", (frequency: number) => {
  addPlayerToRadioChannel(source, frequency);
});

function addRadioSafeGuard(freq: number, func: RadioSafeGuard): number {
  if (!radioEnabled || freq <= 0) {
    return -1;
  }

  const data = channelData[freq];

  if (data) {
    return data.addSafeGuard(func);
  } else {
    return -1;
  }
}
global.exports("addRadioSafeGuard", addRadioSafeGuard);

function removeRadioSafeGuard(freq: number, idx: number): boolean {
  if (!radioEnabled || freq <= 0) {
    return false;
  }

  const data = channelData[freq];

  if (data) {
    data.removeSafeGuard(idx);
  }

  return !!data;
}
global.exports("removeRadioSafeGuard", removeRadioSafeGuard);

function removePlayerFromRadioChannel(src: number, frequency: number): boolean {
  if (!radioEnabled || frequency <= 0) {
    return false;
  }

  const channel = channelData[frequency];
  const player = playerData[src];

  if (channel && player) {
    channel.removePlr(src);
    player.removeChannel(frequency);

    return true;
  } else {
    return false;
  }
}
global.exports("removePlayerFromRadioChannel", removePlayerFromRadioChannel);

onNet(
  "zerio-voice:server:removePlayerFromRadioChannel",
  (frequency: number) => {
    removePlayerFromRadioChannel(source, frequency);
  }
);

function handleNewPlayer(src: number) {
  playerData[src] = new PlayerRadioData(src);
}

function handlePlayerRemoval(src: number) {
  const data = playerData[src];

  if (data) {
    for (let i = 0; i < data.channels.length; i++) {
      const v = data.channels[i];

      if (v) {
        const channel = channelData[v];

        if (channel) {
          channel.removePlr(src);
        }
      }
    }

    delete playerData[src];
  }
}

onNet("playerJoining", () => {
  handleNewPlayer(source);
});

onNet("playerDropped", () => {
  handlePlayerRemoval(source);
});

onNet("zerio-voice:server:setTalkingOnRadio", () => {
  const plr = Player(source);
  const radioFreq = plr.state.currentRadioFreq;
  const isTalking = plr.state.talkingOnRadio;

  if (!radioFreq) {
    return;
  }

  const channel = channelData[radioFreq];

  if (channel) {
    channel.updateTalkingState(source, isTalking);
  }
});

const debug = GetConvarInt("zerio_voice_debug", 0);

function debugPrint() {
  if (debug >= 2) {
    info("----------");
    info("channelData", JSON.stringify(channelData));
    info("playerData", JSON.stringify(playerData));
  }
}

if (debug >= 1) {
  RegisterCommand(
    "debugPrint",
    () => {
      debugPrint();
    },
    true
  );

  RegisterCommand(
    "addPlayerToRadioChannel",
    (_src: number, args: Array<string>) => {
      addPlayerToRadioChannel(Number(args[0]), Number(args[1]));
      debugPrint();
    },
    true
  );

  RegisterCommand(
    "removePlayerFromRadioChannel",
    (_src: number, args: Array<string>) => {
      removePlayerFromRadioChannel(Number(args[0]), Number(args[1]));
      debugPrint();
    },
    true
  );

  RegisterCommand(
    "handleNewPlayer",
    (_src: number, args: Array<string>) => {
      handleNewPlayer(Number(args[0]));
      debugPrint();
    },
    true
  );

  RegisterCommand(
    "handlePlayerRemoval",
    (_src: number, args: Array<string>) => {
      handlePlayerRemoval(Number(args[0]));
      debugPrint();
    },
    true
  );
}

initialize();
