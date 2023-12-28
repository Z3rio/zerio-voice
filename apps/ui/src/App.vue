<script setup lang="ts">
import { onMounted, ref, Ref } from "vue";

const talking: Ref<boolean> = ref(false);

onMounted(() => {
  window.addEventListener("message", (e: MessageEvent) => {
    switch (e.data.action) {
      case "isTalking":
        talking.value = e.data.data.normal;
        break;
    }
  });
});
</script>

<template>
  <div class="status">You are {{ talking ? "talking" : "not talking" }}</div>
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
