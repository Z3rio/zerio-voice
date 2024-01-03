import { getConfig } from "@zerio-voice/utils/config";
import { validateConfig } from "@zerio-voice/utils/validation";
import { success, warn } from "@zerio-voice/utils/logger";
import { VoiceData } from "./classes/voiceData";

let defaultProximity = -1;
const mappedChannels: Record<number, number> = {};
const voiceData: Record<number, VoiceData> = {};

function initialize() {
  const cfg = getConfig();

  if (cfg) {
    if (!validateConfig(cfg)) {
      warn("Your config does not seem to be valid");
    } else {
      SetResourceKvp("zerio-voice_logLevel", cfg.logging.level);
      SetResourceKvp("zerio-voice_locale", cfg.locale.language);
      SetResourceKvpInt(
        "zerio-voice_noTalkOverMode",
        cfg.radio.noTalkOverMode ? 1 : 0
      );
      defaultProximity = cfg.voiceModes.findIndex((v) => v.default);

      success("Your config seems to be valid");
    }
  }

  require("./modules/radio");
  require("./modules/muting");

  const plrs = getPlayers();

  for (let i = 0; i < plrs.length; i++) {
    const src = Number(plrs[i]);

    if (src) {
      handleNewPlayer(src);
    }
  }
}

function findFirstFreeChannel() {
  for (let i = 0; i < 2048; i++) {
    if (mappedChannels[i] === undefined) {
      return i;
    }
  }

  return -1;
}

function handleNewPlayer(source: number) {
  const firstFreeChannel = findFirstFreeChannel();

  if (firstFreeChannel !== -1) {
    mappedChannels[firstFreeChannel] = source;
  }

  voiceData[source] = new VoiceData(source, firstFreeChannel);

  const plr = Player(source);

  plr.state.set("submix", null, true);
  plr.state.set("talkingOnRadio", false, true);
  plr.state.set("proximity", defaultProximity, true);
  plr.state.set("muted", false, true);
  MumbleSetPlayerMuted(source, false);
}

onNet("playerJoining", () => {
  handleNewPlayer(source);
});

onNet("playerDropped", () => {
  const assignedChannel = Player(source).state.assignedChannel;

  if (voiceData[source]) {
    delete voiceData[source];
  }

  if (assignedChannel && mappedChannels[assignedChannel]) {
    delete mappedChannels[assignedChannel];
  }
});

initialize();
