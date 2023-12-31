<script setup lang="ts">
defineProps<{
  path: string;
  height: number;
  width: number;
}>();
</script>

<template>
  <svg :width="width" :height="height" viewbox="0 0 0 0">
    <path :d="path" />
  </svg>
</template>
