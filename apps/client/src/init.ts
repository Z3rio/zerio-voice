import { VoiceRanges } from "@zerio-voice/utils/data";
import { Wait } from "@zerio-voice/utils/functions";

const voiceTarget = 1;
const serverId = GetPlayerServerId(PlayerId());

onNet("mumbleConnected", async () => {
  MumbleSetTalkerProximity(VoiceRanges.Normal);
  MumbleClearVoiceTarget(voiceTarget);
  MumbleSetVoiceTarget(voiceTarget);
  MumbleSetVoiceChannel(LocalPlayer.state.assignedChannel);

  while (
    MumbleGetVoiceChannelFromServerId(serverId) !==
    LocalPlayer.state.assignedChannel
  ) {
    await Wait(250);
    MumbleSetVoiceChannel(LocalPlayer.state.assignedChannel);
  }

  MumbleAddVoiceTargetChannel(voiceTarget, LocalPlayer.state.assignedChannel);
});

onNet("onPlayerDropped", (id: number) => {
  MumbleRemoveVoiceChannelListen(id);
});

onNet("onPlayerJoining", (id: number) => {
  MumbleAddVoiceChannelListen(id);
});
