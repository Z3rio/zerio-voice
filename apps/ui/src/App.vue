<script setup lang="ts">
import { useMainStore, useRadioStore } from "@stores";
import { postRequest } from "@utils";
import { onMounted, ref, Ref } from "vue";
import { storeToRefs } from "pinia";

import VoiceState from "@components/VoiceState.vue";
import RadioMemberList from "@components/RadioMemberList.vue";

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
      case "playRadioMicClicks": {
        const sound = (e.data.data.toggled ? micClickOn : micClickOff).value;

        if (sound) {
          sound.load();
          sound.volume = e.data.data.volume;
          sound.play().catch(console.warn);
        }
        break;
      }
      case "setTalkingOnRadio":
        if (radioStore.list[e.data.data.frequency]) {
          const foundIdx = radioStore.list[e.data.data.frequency].findIndex(
            (p) => p.source === e.data.data.source
          );

          if (foundIdx !== -1) {
            radioStore.list[e.data.data.frequency][foundIdx].talking = e.data.data.isTalking;
          }
        }
        break;
      case "syncRawRadioPlayers":
        radioStore.list[e.data.data.frequency] = e.data.data.players;
        break;
      case "playerAddedToRadioChannel":
        if (radioStore.list[e.data.data.frequency]) {
          radioStore.list[e.data.data.frequency].push(e.data.data.plr);
        }
        break;
      case "removedFromRadioChannel":
        delete radioStore.list[e.data.data];
        break;
      case "removePlayerFromRadioChannel":
        if (radioStore.list[e.data.data.frequency]) {
          radioStore.list[e.data.data.frequency] = radioStore.list[e.data.data.frequency].filter(
            (p) => p.source !== e.data.data.source
          );
        }
        break;
      case "loadRadioMemberListSettings":
        radioStore.enableMemberList = e.data.data.enabled;
        radioStore.showMembersOfAllChannels = e.data.data.showMembersOfAllChannels;
        break;
    }
  });

  window.addEventListener("keydown", (e: KeyboardEvent) => {
    switch (e.key.toLowerCase()) {
      case "escape":
        mainStore.close();
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
    <RadioMemberList />
    <VoiceState />
  </template>
</template>
