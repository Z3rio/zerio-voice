import { NuiCallback } from "@zerio-voice/utils/structs";
import { getTranslation } from "@zerio-voice/utils/translations";

const gameName = GetGameName();
let hasFocus = false;
let holdingDownKey: null | number = null;
const keybind = GetResourceKvpString("zerio-voice_interactionKey");
const uiEnabled = GetResourceKvpInt("zerio-voice_enabledUI") == 1;
const requireMousePressAswell =
  GetResourceKvpInt("zerio-voice_requireMousePressAswell") === 1;

function toggleFocus(toggled: boolean) {
  if (hasFocus !== toggled) {
    hasFocus = toggled;

    SetNuiFocus(false, toggled);
  }
}

function stopHoldingTick() {
  if (holdingDownKey) {
    clearTick(holdingDownKey);
    holdingDownKey = null;
  }
}

if (uiEnabled) {
  if (gameName == "fivem") {
    RegisterCommand(
      "+voicefocus",
      () => {
        if (requireMousePressAswell) {
          holdingDownKey = setTick(() => {
            if (IsControlJustReleased(0, 25)) {
              toggleFocus(true);
              stopHoldingTick();
            }
          });
        } else {
          toggleFocus(true);
        }
      },
      false,
    );

    RegisterCommand(
      "-voicefocus",
      () => {
        toggleFocus(false);
        stopHoldingTick();
      },
      false,
    );

    RegisterKeyMapping(
      "+voicefocus",
      getTranslation(["misc", "focusKeybind"]),
      "keyboard",
      keybind,
    );
  } else if (gameName == "redm") {
    // todo: redm control handling
  }
}

RegisterNuiCallback("load", (_data: unknown, cb: NuiCallback) => {
  SendNUIMessage({
    action: "updateVisibility",
    data: uiEnabled,
  });

  if (uiEnabled) {
    SendNUIMessage({
      action: "setCurrentRadioChannel",
      data: LocalPlayer.state.currentRadioFreq,
    });
  }

  cb("ok");
});
