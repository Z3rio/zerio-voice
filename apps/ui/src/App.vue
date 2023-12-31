<script setup lang="ts">
import RadioList from "@components/RadioList.vue";
import VoiceState from "@components/VoiceState.vue";
import { useMainStore, useRadioStore } from "@stores";
import { postRequest } from "@utils";
import { onMounted, ref, Ref } from "vue";
import { storeToRefs } from "pinia";

const mainStore = useMainStore();
const radioStore = useRadioStore();
const { enabled } = storeToRefs(mainStore);

const micClickOn: Ref<null | HTMLAudioElement> = ref(null);
const micClickOff: Ref<null | HTMLAudioElement> = ref(null);

onMounted(() => {
  window.addEventListener("message", (e: MessageEvent) => {
    switch (e.data.action) {
      case "isTalkingNormally":
        mainStore.talking.normal = e.data.data;
        break;
      case "isTalkingOnRadio":
        mainStore.talking.radio = e.data.data;
        break;
      case "updateVisibility":
        mainStore.enabled = e.data.data;
        break;
      case "updateDebugState":
        mainStore.debug = e.data.data;
        break;
      case "setCurrentRadioChannel":
        radioStore.current = e.data.data;
        break;
      case "playRadioMicClicks":
        let sound = (e.data.data.toggled ? micClickOn : micClickOff).value;

        if (sound) {
          sound.load();
          sound.volume = e.data.data.volume;
          sound.play().catch(console.warn);
        }
        break;
      case "setTalkingOnRadio":
        break;
      case "syncRawRadioPlayers":
        break;
      case "playerAddedToRadioChannel":
        break;
      case "removedFromRadioChannel":
        break;
      case "removePlayerFromRadioChannel":
        break;
    }
  });

  window.addEventListener("keydown", (e: KeyboardEvent) => {
    switch (e.key.toLowerCase()) {
      case "escape":
        postRequest("removeFocus");
        break;
    }
  });

  /*  load initial cfg/state
   *  this is used as the client & ui might load/initialize in different orders
   *  meaning that we cant just assume that the ui is loaded when the client sends an nui event with all the initial state
   */
  let loaded = false;
  function tryToLoad() {
    postRequest("load")
      .then(() => {
        loaded = true;
      })
      .catch(() => {
        setTimeout(() => {
          if (!loaded) {
            tryToLoad();
          }
        }, 1000);
      });
  }

  tryToLoad();
});
</script>

<template>
  <audio ref="micClickOn" src="mic_click_on.ogg" />
  <audio ref="micClickOff" src="mic_click_off.ogg" />

  <template v-if="enabled">
    <RadioList />
    <VoiceState />
  </template>
</template>

<style scoped lang="scss"></style>
