import { defineStore } from "pinia";

const useMainStore = defineStore("main", {
  state: () => ({
    talking: false,
    enabled: true,
  }),
});

export default useMainStore;
