import { getConfig } from "@zerio-voice/utils/config";
import { PlayerRadioData, RadioChannelData } from "../classes/radioData";

let radioEnabled = true;
const playerData: Record<number, PlayerRadioData> = {};
const channelData: Record<number, RadioChannelData> = {};

function addPlayerToRadioChannel(src: number, frequency: number): boolean {
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
    player.addChannel(frequency);
    channel.addPlr(src);

    return true;
  } else {
    return false;
  }
}
global.exports("addPlayerToRadioChannel", addPlayerToRadioChannel);

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

onNet("onResourceStart", (resName: string) => {
  if (GetCurrentResourceName() == resName) {
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
});

onNet("playerJoining", () => {
  handleNewPlayer(source);
});

onNet("playerDropped", () => {
  handlePlayerRemoval(source);
});

const debug = false;

if (debug) {
  function debugPrint() {
    console.log("channelData", JSON.stringify(channelData));
    console.log("playerData", JSON.stringify(playerData));
  }

  RegisterCommand("debugPrint", debugPrint, false);

  RegisterCommand(
    "addPlayerToRadioChannel",
    (_src: number, args: string[], _raw: string) => {
      addPlayerToRadioChannel(Number(args[0]), Number(args[1]));
      debugPrint();
    },
    false,
  );

  RegisterCommand(
    "removePlayerFromRadioChannel",
    (_src: number, args: string[], _raw: string) => {
      removePlayerFromRadioChannel(Number(args[0]), Number(args[1]));
      debugPrint();
    },
    false,
  );

  RegisterCommand(
    "handleNewPlayer",
    (_src: number, args: string[], _raw: string) => {
      handleNewPlayer(Number(args[0]));
      debugPrint();
    },
    false,
  );

  RegisterCommand(
    "handlePlayerRemoval",
    (_src: number, args: string[], _raw: string) => {
      handlePlayerRemoval(Number(args[0]));
      debugPrint();
    },
    false,
  );
}
