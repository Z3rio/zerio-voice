import { format, getTranslation } from "@zerio-voice/utils/translations";
import { notify } from "../integrations/wrapper";

const mutedPlayers: Record<number, ReturnType<typeof setTimeout> | null> = {};

function mutePlayer(src: number, duration?: number) {
  if (mutedPlayers[src] == undefined) {
    MumbleSetPlayerMuted(src, true);
    Player(src).state.muted = true;

    if (duration && duration !== -1) {
      mutedPlayers[src] = setTimeout(() => {
        unmutePlayer(src);
      }, duration * 1000);
    } else {
      mutedPlayers[src] = null;
    }
  }
}
global.exports("mutePlayer", mutePlayer);

function unmutePlayer(src: number) {
  MumbleSetPlayerMuted(src, false);
  Player(src).state.muted = false;

  const plr = mutedPlayers[src];

  if (plr) {
    clearTimeout(plr);
  }

  delete mutedPlayers[src];
}
global.exports("unmutePlayer", unmutePlayer);

RegisterCommand(
  "globalmuteplayer",
  (src: number, args: Array<string>) => {
    if (args[0]) {
      const targetSrc = Number(args[0]);
      const duration = args[1] ? Number(args[1]) : -1;
      const name = GetPlayerName(targetSrc.toString());

      if (name) {
        if (mutedPlayers[targetSrc] === undefined) {
          mutePlayer(targetSrc, duration);

          if (src !== 0) {
            notify(
              src,
              format(getTranslation(["commands", "playerMuted"]), [
                GetPlayerName(targetSrc.toString()),
                targetSrc
              ])
            );
          }
        } else {
          notify(
            src,
            format(getTranslation(["commands", "playerAlreadyMuted"]), [
              GetPlayerName(targetSrc.toString()),
              targetSrc
            ])
          );
        }
      } else if (src !== 0) {
        // if name is nil, then the player probably doesnt exist
        notify(
          src,
          format(getTranslation(["commands", "invalidPlayer"]), [targetSrc])
        );
      }
    }
  },
  true
);

RegisterCommand(
  "globalunmuteplayer",
  (src: number, args: Array<string>) => {
    if (args[0]) {
      const targetSrc = Number(args[0]);
      const name = GetPlayerName(targetSrc.toString());

      if (name) {
        unmutePlayer(targetSrc);

        if (src !== 0) {
          notify(
            src,
            format(getTranslation(["commands", "playerUnmuted"]), [
              name,
              targetSrc
            ])
          );
        }
      } else if (src !== 0) {
        // if name is nil, then the player probably doesnt exist
        notify(
          src,
          format(getTranslation(["commands", "invalidPlayer"]), [targetSrc])
        );
      }
    }
  },
  true
);

onNet("playerDropped", () => {
  unmutePlayer(source);
  emitNet("zerio-voice:cient:unmutePlayer", -1, source);
});
