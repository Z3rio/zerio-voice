<script setup lang="ts">
import RadioList from "@components/RadioList.vue";
import VoiceState from "@components/VoiceState.vue";
import useMainStore from "@stores/main";
import { onMounted } from "vue";
import { storeToRefs } from "pinia";

const mainStore = useMainStore();
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
      case "playRadioMicClicks":
        let click = document.getElementById(
          `audio_${e.data.data.toggled ? "on" : "off"}`,
        );

        if (click) {
          click.load();
          click.volume = e.data.data.volume;
          click.play().catch((e) => {
            console.warn(e);
          });
        }
        break;
    }
  });
});
</script>

<template>
  <audio id="audio_on" src="mic_click_on.ogg" />
  <audio id="audio_off" src="mic_click_off.ogg" />

  <template v-if="enabled">
    <RadioList />
    <VoiceStaete />
  </template>
</template>

<style scoped lang="scss"></style>
