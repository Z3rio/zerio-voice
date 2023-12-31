import { defineStore } from "pinia";

export const useRadioStore = defineStore("radio", {
  state: () => ({
    current: <number | null>null,
  }),
});
