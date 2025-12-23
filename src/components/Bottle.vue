<template>
  <div
    class="bottle w-12 h-20 bg-gray-200 border-2 border-gray-400 rounded-b-xl relative overflow-hidden flex flex-col justify-end items-center"
    :class="bottleColor"
    :title="`ID: ${id}, Peso: ${weight}`"
  >
    <div
      class="liquid w-full"
      :style="{ height: `${weight}%`, backgroundColor: liquidColor }"
    ></div>

  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  id: number;
  weight: number;
  color: string; // Tailwind class like 'bg-red-300'
}>();

const bottleColor = computed(() => props.color);

// A darker shade for the "liquid" to make it stand out from the bottle background
const liquidColor = computed(() => {
  if (props.color.includes('red')) return 'rgb(239 68 68)'; // red-500
  if (props.color.includes('blue')) return 'rgb(59 130 246)'; // blue-500
  if (props.color.includes('green')) return 'rgb(34 197 94)'; // green-500
  if (props.color.includes('purple')) return 'rgb(168 85 247)'; // purple-500
  if (props.color.includes('pink')) return 'rgb(236 72 153)'; // pink-500
  if (props.color.includes('indigo')) return 'rgb(99 102 241)'; // indigo-500
  if (props.color.includes('yellow')) return 'rgb(234 179 8)'; // yellow-500
  if (props.color.includes('teal')) return 'rgb(20 184 166)'; // teal-500
  return 'rgb(107 114 128)'; // gray-500 default
});
</script>

<style scoped>
.bottle {
  min-height: 80px; /* Ensure a minimum height for all bottles */
}
</style>
