import { defineStore } from "pinia";
import { RadioMember } from "@zerio-voice/utils/structs";

export const useRadioStore = defineStore("radio", {
  state: () => ({
    current: <number | null>null,
    list: <Record<number, Array<RadioMember>>>{},
    enableMemberList: true,
    showMembersOfAllChannels: false,
  }),
});
