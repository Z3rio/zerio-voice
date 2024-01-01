<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useMainStore, useRadioStore } from "@stores";
import { mdiMicrophone } from "@mdi/js";
import { ref, Ref, onMounted, onUnmounted } from "vue";

import SvgIcon from "@components/SvgIcon.vue";
import RadioSwitcher from "@components/RadioSwitcher.vue";

const mainStore = useMainStore();
const radioStore = useRadioStore();

const { talking } = storeToRefs(mainStore);
const { current } = storeToRefs(radioStore);
const showRadioSwitcher: Ref<boolean> = ref(false);

const nf = Intl.NumberFormat();

function MessageHandler(e: MessageEvent) {
  switch (e.data.action) {
    case "closed":
      showRadioSwitcher.value = false;
      break;
  }
}

onMounted(() => {
  window.addEventListener("message", MessageHandler);
});

onUnmounted(() => {
  window.removeEventListener("message", MessageHandler);
});
</script>

<template>
  <div class="absolute right-2 bottom-2 flex flex-col gap-2 items-end h-fit">
    <RadioSwitcher :show="showRadioSwitcher" />

    <div class="flex flex-row gap-2 relative w-fit">
      <!-- Radio Voice State -->
      <div
        class="bg-slate-900/90 rounded h-8 flex justify-center items-center w-fit px-6 shadow-xl text-white min-w-[150px] cursor-pointer"
        v-if="current"
        @click="showRadioSwitcher = !showRadioSwitcher"
        v-wave
      >
        {{ nf.format(current) }} MHz
      </div>

      <!-- Main Voice State -->
      <div
        class="w-8 h-8 bg-slate-900/90 rounded flex items-center justify-center shadow-xl"
      >
        <SvgIcon
          :path="mdiMicrophone"
          :height="24"
          :width="24"
          :class="{
            'fill-[#bbb]': !talking.normal,
            'fill-white': talking.normal
          }"
        />
      </div>
    </div>
  </div>
</template>
