import { VoiceRanges } from "@zerio-voice/utils/data";
import { Wait } from "@zerio-voice/utils/functions";
import { getConfig } from "@zerio-voice/utils/config";

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

let normalTalkingStatus = false;
onNet("onClientResourceStart", async (resourceName: string) => {
  if (GetCurrentResourceName() == resourceName) {
    const cfg = getConfig();

    if (cfg) {
      while (!MumbleIsConnected()) {
        Wait(250);
      }

      setInterval(() => {
        if (cfg.enableUI) {
          const currentTalkingStatus =
            (MumbleIsPlayerTalking(PlayerId()) as number | boolean) === 1;

          if (currentTalkingStatus !== normalTalkingStatus) {
            normalTalkingStatus = currentTalkingStatus;

            SendNUIMessage({
              action: "isTalking",

              data: {
                normal: normalTalkingStatus,
              },
            });
          }
        }
      }, 250);
    }
  }
});
