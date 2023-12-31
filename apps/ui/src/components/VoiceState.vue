<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useMainStore, useRadioStore } from "@stores";
import { mdiMicrophone } from "@mdi/js";
import Icon from "@components/Icon.vue";

const mainStore = useMainStore();
const radioStore = useRadioStore();

const { talking } = storeToRefs(mainStore);
const { current } = storeToRefs(radioStore);

const nf = Intl.NumberFormat();
</script>

<template>
  <div class="absolute right-2 bottom-2 flex flex-row-reverse gap-2">
    <!-- Main Voice State -->
    <div
      class="w-8 h-8 bg-slate-900/90 rounded flex items-center justify-center shadow-xl"
    >
      <Icon
        :path="mdiMicrophone"
        :height="24"
        :width="24"
        :class="{
          'fill-[#bbb]': !talking.normal,
          'fill-white': talking.normal,
        }"
      />
    </div>

    <!-- Radio Voice State -->
    <div
      class="bg-slate-900/90 rounded h-8 flex items-center w-fit px-6 shadow-xl text-white"
      v-if="current"
    >
      {{ nf.format(current) }} MHz
    </div>
  </div>
</template>
