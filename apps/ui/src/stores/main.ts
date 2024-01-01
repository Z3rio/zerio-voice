import { defineStore } from "pinia";
import { Talking } from "@zerio-voice/utils/structs";
import { postRequest } from "@utils";

export const useMainStore = defineStore("main", {
  state: () => ({
    talking: <Talking>{
      normal: false,
      radio: false
    },
    isOpen: false,
    debug: 0,
    enabled: true
  }),

  actions: {
    close: () => {
      postRequest("removeFocus");
    },
    changeFrequency: (frequency: number) => {
      postRequest("changeFrequency", {
        frequency: frequency
      });
    }
  }
});
