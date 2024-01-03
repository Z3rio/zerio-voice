import { notify } from "../integrations/wrapper";
import { isPlayerMuted } from "./muting";
import { format, getTranslation } from "@zerio-voice/utils/translations";

const customVolumes: Record<number, number> = {};

export function getPlayerVolume(src: number): number {
  const vol = customVolumes[src];

  if (vol === undefined) {
    return 1.0;
  } else {
    return vol;
  }
}

export function updatePlayerVolume(src: number, vol: number) {
  if (!isPlayerMuted(src)) {
    MumbleSetVolumeOverrideByServerId(src, vol);

    if (vol !== -1) {
      customVolumes[src] = vol;
    } else {
      delete customVolumes[src];
    }

    return true;
  }

  return false;
}
global.exports("updatePlayerVolume", updatePlayerVolume);

onNet("zerio-voice:client:playerLeft", (src: number) => {
  delete customVolumes[src];
});

RegisterCommand(
  "playervolume",
  (_src: number, args: Array<string>) => {
    if (args[0] && args[1]) {
      const targetSrc = Number(args[0]);
      const newVolume = Number(args[1]);
      const name = GetPlayerName(targetSrc);

      if (name) {
        const retVal = updatePlayerVolume(targetSrc, newVolume / 100);

        if (retVal) {
          notify(
            format(getTranslation(["commands", "updatedVolume"]), [
              GetPlayerName(targetSrc),
              targetSrc,
              newVolume
            ])
          );
        } else {
          notify(
            format(getTranslation(["commands", "playerIsMuted"]), [
              GetPlayerName(targetSrc),
              targetSrc
            ])
          );
        }
      } else {
        // if name is nil, then the player probably doesnt exist
        notify(
          format(getTranslation(["commands", "invalidPlayer"]), [targetSrc])
        );
      }
    }
  },
  false
);
emit(
  "chat:addSuggestion",
  "/playervolume",
  "Locally update the volume of a player",
  [
    {
      name: "id",
      help: "Player ID"
    },
    {
      name: "volume",
      help: "New volume (0-100)"
    }
  ]
);
