<script setup lang="ts">
import { storeToRefs } from "pinia";
import useMainStore from "@stores/main";

const mainStore = useMainStore();

const { talking } = storeToRefs(mainStore);
</script>

<template>
  <div class="status">
    You are {{ talking.normal ? "talking" : "not talking" }}
  </div>
</template>

<style scoped lang="scss">
.status {
  position: absolute;

  right: 16px;
  bottom: 16px;

  color: #fff;
  background: rgba(0, 0, 0, 0.5);

  padding: 8px 16px;
}
</style>
