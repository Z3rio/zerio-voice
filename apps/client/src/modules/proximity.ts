import { VoiceMode } from "@zerio-voice/utils/structs";
import { format, getTranslation } from "@zerio-voice/utils/translations";
import { notify } from "../integrations/wrapper";

let markerTick: null | number = null;
let markerTimeout: null | ReturnType<typeof setTimeout> = null;
let markerSize = -1;
let firstTime = true;

export function init(voiceModes: Array<VoiceMode>, keybind: string) {
  AddStateBagChangeHandler(
    "proximity",
    "",
    (_name: string, _key: string, val: number | null) => {
      if (val !== null) {
        const voiceMode = voiceModes[val];
        if (voiceMode) {
          MumbleSetTalkerProximity(voiceMode.range);

          notify(
            format(getTranslation(["proximity", "changed"]), [voiceMode.name])
          );

          if (firstTime === false) {
            markerSize = voiceMode.range;

            if (markerTick == null) {
              markerTick = setTick(() => {
                const coords = GetEntityCoords(PlayerPedId(), true);

                if (coords[0] && coords[1] && coords[2]) {
                  DrawMarker(
                    1,
                    coords[0],
                    coords[1],
                    coords[2] - 1,
                    0.0,
                    0.0,
                    0.0,
                    0.0,
                    0.0,
                    0.0,
                    markerSize * 2.0,
                    markerSize * 2.0,
                    0.75,
                    59,
                    66,
                    200,
                    100,
                    false,
                    true,
                    2,
                    false,
                    //@ts-expect-error: needed as the type for this is wrong
                    null,
                    null,
                    false
                  );
                }
              });

              if (markerTimeout) {
                clearTimeout(markerTimeout);
              }

              markerTimeout = setTimeout(() => {
                if (markerTick !== null) {
                  clearTick(markerTick);
                  markerTick = null;
                  markerTimeout = null;
                }
              }, 2000);
            }
          } else {
            firstTime = false;
          }
        }
      }
    }
  );

  RegisterCommand(
    "changeproximity",
    (_src: number, args: Array<string>) => {
      const arg = args[0];

      if (!arg) {
        // used by keymapping
        const curr = LocalPlayer.state.proximity;

        if (curr !== null) {
          if (curr + 1 == voiceModes.length) {
            LocalPlayer.state.set("proximity", 0, true);
          } else {
            LocalPlayer.state.set("proximity", curr + 1, true);
          }
        }
      } else {
        if (Number(arg).toString() == arg) {
          LocalPlayer.state.set("proximity", Number(arg), true);
        } else {
          const found = voiceModes.findIndex(
            (v) => v.name.toLowerCase() == arg.toLowerCase()
          );

          if (found !== -1) {
            LocalPlayer.state.set("proximity", found, true);
          } else {
            notify(getTranslation(["commands", "invalidProximity"]));
          }
        }
      }
    },
    false
  );
  emit(
    "chat:addSuggestion",
    "/changeproximity",
    "Change your current proximity state",
    [
      {
        name: "proximity",
        help:
          "Valid values: " +
          voiceModes.reduce(
            (acc: null | string, curr: VoiceMode) =>
              (acc ? acc + ", " : "") + curr.name,
            null
          )
      }
    ]
  );
  RegisterKeyMapping(
    "changeproximity",
    getTranslation(["proximity", "keybind"]),
    "keyboard",
    keybind
  );
}
