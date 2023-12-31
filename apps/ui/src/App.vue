<script setup lang="ts">
import RadioList from "@components/RadioList.vue";
import VoiceState from "@components/VoiceState.vue";
import { useMainStore, useRadioStore } from "@stores";
import { postRequest } from "@utils";
import { onMounted } from "vue";
import { storeToRefs } from "pinia";

const mainStore = useMainStore();
const radioStore = useRadioStore();
const { enabled } = storeToRefs(mainStore);

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
      case "setCurrentRadioChannel":
        radioStore.current = e.data.data;
        break;
      case "playRadioMicClicks":
        let sound = document.getElementById(
          `audio_${e.data.data.toggled ? "on" : "off"}`,
        );

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
  <audio id="audio_on" src="mic_click_on.ogg" />
  <audio id="audio_off" src="mic_click_off.ogg" />

  <template v-if="enabled">
    <RadioList />
    <VoiceState />
  </template>
</template>

<style scoped lang="scss"></style>
