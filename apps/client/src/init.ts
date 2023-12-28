import { VoiceRanges } from "@zerio-voice/utils/data";
import { getDistance, Wait } from "@zerio-voice/utils/functions";
import { getConfig } from "@zerio-voice/utils/config";
import { warn } from "@zerio-voice/utils/logger";

const voiceTarget = 1;
const serverId = GetPlayerServerId(PlayerId());
let proximity = MumbleGetTalkerProximity();
let normalTalkingStatus = false;

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

function updateNUIVoiceStatus() {
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

function proximityCheck(
  coords1: number[],
  coords2: number[],
): [boolean, number] {
  const dist = getDistance(coords1, coords2);

  return [dist !== -1 && dist < proximity, dist];
}

function checkForNearbyPlayers() {
  const plr = PlayerPedId();

  if (plr) {
    const coords = GetEntityCoords(plr, true);
    proximity = MumbleGetTalkerProximity();

    MumbleClearVoiceTargetChannels(voiceTarget);
    MumbleAddVoiceChannelListen(LocalPlayer.state.assignedChannel);
    MumbleAddVoiceTargetChannel(voiceTarget, LocalPlayer.state.assignedChannel);

    const plrs = GetActivePlayers();

    for (let i = 0; i < plrs.length; i++) {
      const v = plrs[i];
      const serverId = GetPlayerServerId(v);
      const [shouldAdd, _distance] = proximityCheck(
        coords,
        GetEntityCoords(GetPlayerPed(v), true),
      );

      if (shouldAdd) {
        MumbleAddVoiceTargetChannel(
          voiceTarget,
          MumbleGetVoiceChannelFromServerId(serverId),
        );
      }
    }
  }
}

onNet("onClientResourceStart", async (resourceName: string) => {
  if (GetCurrentResourceName() == resourceName) {
    const cfg = getConfig();

    if (cfg) {
      while (!MumbleIsConnected()) {
        warn("Awaiting mumble connection");
        await Wait(250);
      }

      setInterval(() => {
        if (cfg.enableUI) {
          updateNUIVoiceStatus();
        }

        checkForNearbyPlayers();
      }, 250);
    }
  }
});
