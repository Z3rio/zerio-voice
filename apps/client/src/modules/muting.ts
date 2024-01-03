import { notify } from "../integrations/wrapper";
import { format, getTranslation } from "@zerio-voice/utils/translations";

const mutedPlayers: Record<number, null | ReturnType<typeof setTimeout>> = {};

function mutePlayer(src: number, duration?: number) {
  MumbleSetVolumeOverrideByServerId(src, 0.0);

  if (!duration) {
    mutedPlayers[src] = null;
  } else {
    mutedPlayers[src] = setTimeout(() => {
      unmutePlayer(src);
    }, duration * 1000);
  }
}
global.exports("mutePlayer", mutePlayer);

function unmutePlayer(src: number) {
  MumbleSetVolumeOverrideByServerId(src, -1.0);

  const plr = mutedPlayers[src];

  if (plr) {
    clearTimeout(plr);
  }

  delete mutedPlayers[src];
}
global.exports("unmutePlayer", unmutePlayer);

export function isPlayerMuted(src: number): boolean {
  return mutedPlayers[src] !== undefined;
}
global.exports("isPlayerMuted", isPlayerMuted);

RegisterCommand(
  "muteplayer",
  (_src: number, args: Array<string>) => {
    if (args[0]) {
      const targetSrc = Number(args[0]);
      const duration = args[1] ? Number(args[1]) : -1;

      if (mutedPlayers[targetSrc] === undefined) {
        mutePlayer(targetSrc, duration);

        notify(
          format(getTranslation(["commands", "playerMuted"]), [targetSrc])
        );
      } else {
        notify(
          format(getTranslation(["commands", "playerAlreadyMuted"]), [
            targetSrc
          ])
        );
      }
    }
  },
  false
);
emit("chat:addSuggestion", "/muteplayer", "Locally mutes a player", [
  {
    name: "id",
    help: "Player ID"
  }
]);

RegisterCommand(
  "unmuteplayer",
  (_src: number, args: Array<string>) => {
    if (args[0]) {
      const targetSrc = Number(args[0]);
      unmutePlayer(targetSrc);

      notify(
        format(getTranslation(["commands", "playerUnmuted"]), [targetSrc])
      );
    }
  },
  false
);
emit("chat:addSuggestion", "/unmuteplayer", "Locally unmutes a player", [
  {
    name: "id",
    help: "Player ID"
  }
]);

onNet("zerio-voice:client:playerLeft", (src: number) => {
  unmutePlayer(src);
});
