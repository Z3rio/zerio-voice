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
  current
} = storeToRefs(radioStore);

const members: Computed<Array<RadioMember>> = computed(() => {
  if (showMembersOfAllChannels.value) {
    const retVal: Array<RadioMember> = new Array();

    for (const key in list.value) {
      const v = list.value[key];

      if (v) {
        for (let i = 0; i < v.length; i++) {
          const v2 = v[i];

          if (v2) {
            if (retVal[v2.source]) {
              if (retVal[v2.source].talking !== true && v2.talking === true) {
                retVal[v2.source].talking = true;
              }
            } else {
              retVal[v2.source] = v2;
            }
          }
        }
      }
    }

    return retVal.flat();
  } else if (list.value[current.value]) {
    return list.value[current.value];
  }

  return new Array();
});
</script>

<template>
  <div class="top-2 right-2 absolute flex flex-col" v-if="enabled">
    <div
      v-for="(member, idx) in members"
      :key="idx"
      class=""
      :class="{
        'text-neutral-300': !member.talking,
        'text-white': member.talking
      }"
    >
      {{ member.name }}
    </div>
  </div>
</template>
