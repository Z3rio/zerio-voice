<script setup lang="ts">
import { useMainStore, useRadioStore } from "@stores";
import { storeToRefs } from "pinia";

const mainStore = useMainStore();
const radioStore = useRadioStore();

const { list, current } = storeToRefs(radioStore);

defineProps<{
  show: boolean;
}>();
</script>

<template>
  <div
    class="absolute w-full h-fit flex flex-col bg-slate-900/90 rounded shadow-xl text-white py-4 transition-all duration-300 z-index-20 bottom-[calc(100%+0.5rem)]"
    :class="{
      'right-[calc(-100%-0.5rem)]': !show,
      'right-0': show
    }"
  >
    <div
      v-for="(_members, freq) in list"
      :key="freq"
      class="px-2 py-2"
      :class="{
        'text-yellow-400 font-bold': current === Number(freq),
        'hover:text-white text-neutral-300 cursor-pointer hover:bg-white/5':
          current !== Number(freq)
      }"
      @click="() => mainStore.changeFrequency(Number(freq))"
      v-wave="current === Number(freq) ? false : undefined"
    >
      {{ freq }} MHz
    </div>
  </div>
</template>
