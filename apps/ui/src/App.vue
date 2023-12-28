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
      case "isTalking":
        mainStore.talking = e.data.data.normal;
        break;
      case "updateVisibility":
        mainStore.enabled = e.data.data;
        break;
    }
  });
});
</script>

<template>
  <template v-if="enabled">
    <RadioList />
    <VoiceState />
  </template>
</template>

<style scoped lang="scss"></style>
