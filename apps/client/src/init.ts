import { VoiceRanges, voiceTarget } from "@zerio-voice/utils/data";
import { getDistance, Wait } from "@zerio-voice/utils/functions";
import { getConfig } from "@zerio-voice/utils/config";
import { warn } from "@zerio-voice/utils/logger";

const serverId = GetPlayerServerId(PlayerId());
let proximity = MumbleGetTalkerProximity();
let isTalking = false;

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
  const isCurrentlyTalking =
    (MumbleIsPlayerTalking(PlayerId()) as number | boolean) === 1;

  if (isCurrentlyTalking !== isTalking) {
    isTalking = isCurrentlyTalking;

    SendNUIMessage({
      action: "isTalkingNormally",

      data: isTalking,
    });
  }
}

function proximityCheck(
  coords1: Array<number>,
  coords2: Array<number>,
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
      SetResourceKvp("zerio-voice_locale", cfg.locale.language);
      SetResourceKvp("zerio-voice_radioKeybind", cfg.radio.keybind);
      SetResourceKvpInt("zerio-voice_enableRadio", cfg.radio.enabled ? 1 : 0);
      SetResourceKvpInt(
        "zerio-voice_enableRadioSubmix",
        cfg.submix.radio ? 1 : 0,
      );

      if (!cfg.ui.enabled) {
        SendNUIMessage({
          action: "updateVisibility",
          data: cfg.ui.enabled,
        });
      }

      require("./modules/radio");
      require("./modules/submix");

      while (!MumbleIsConnected()) {
        warn("Awaiting mumble connection");
        await Wait(250);
      }

      setInterval(() => {
        if (cfg.ui.enabled) {
          updateNUIVoiceStatus();
        }

        checkForNearbyPlayers();
      }, 250);
    }
  }
});
