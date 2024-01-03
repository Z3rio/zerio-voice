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

RegisterCommand("mutePlayer", (_src: number, args: Array<string>) => {
  if (args[0]) {
    const src = Number(args[0]);
    const duration = args[1] ? Number(args[1]) : -1;

    mutePlayer(src, duration);
  }
}, true);

RegisterCommand("unmutePlayer", (_src: number, args: Array<string>) => {
  if (args[0]) {
    const src = Number(args[0]);

    unmutePlayer(src);
  }
}, true);

onNet("playerDropped", () => {
  unmutePlayer(source);
});
