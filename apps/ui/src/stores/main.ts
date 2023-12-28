import { defineStore } from "pinia";
import { Talking } from "@zerio-voice/utils/structs";

const useMainStore = defineStore("main", {
  state: () => ({
    talking: <Talking>{
      normal: false,
      radio: false,
    },
    enabled: true,
  }),
});

export default useMainStore;
