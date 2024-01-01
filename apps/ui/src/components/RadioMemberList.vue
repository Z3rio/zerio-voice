<script setup lang="ts">
import { Computed, computed } from "vue";
import { useRadioStore } from "@stores";
import { storeToRefs } from "pinia";
import { RadioMember } from "@zerio-voice/utils/structs";

const radioStore = useRadioStore();
const {
  enableMemberList: enabled,
  showMembersOfAllChannels,
  list,
  current,
} = storeToRefs(radioStore);

const members: Computed<Array<RadioMember>> = computed(() => {
  if (showMembersOfAllChannels.value) {
    return Object.values(list.value).flat();
  } else if (list.value[current.value]) {
    return list.value[current.value];
  }

  return new Array();
});
</script>

<template>
  <div class="top-2 right-2 absolute flex flex-col">
    <div
      v-for="(member, idx) in members"
      :key="idx"
      class=""
      :class="{
        'text-neutral-300': !member.talking,
        'text-white': member.talking,
      }"
    >
      {{ member.name }}
    </div>
  </div>
</template>
