<script setup lang="ts">
import { storeToRefs } from "pinia";
import { ref, Ref } from "vue";
import { useMainStore, useRadioStore } from "@stores";
import { mdiMicrophone } from "@mdi/js";
import Icon from "@components/Icon.vue";

const mainStore = useMainStore();
const radioStore = useRadioStore();

const isHovering: Ref<boolean> = ref(false);
const { talking, debug } = storeToRefs(mainStore);
const { current } = storeToRefs(radioStore);

const nf = Intl.NumberFormat();

function handleMouseOver(_e: MouseEvent): void {
  isHovering.value = true;
}

function handleMouseLeave(_e: MouseEvent): void {
  isHovering.value = false;
}
</script>

<template>
  <div class="absolute right-2 bottom-2 flex flex-row-reverse gap-2">
    <div
      class="absolute w-full h-full scale-y-[2] bottom-0 right-0 scale-x-125 z-index-10"
      :class="{
        'bg-red-500/50': debug >= 3,
      }"
      @mouseover="handleMouseOver"
      @mouseleave="handleMouseLeave"
    />

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
