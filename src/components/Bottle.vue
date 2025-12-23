<template>
  <div
    class="bottle-container"
    :title="`ID: ${id}, Peso: ${weight}`"
    @dblclick="emit('return-bottle', id)"
  >
    <div
      class="bottle relative w-12 h-20 border-2 border-gray-400/50 rounded-t-lg rounded-b-xl flex flex-col justify-end items-center cursor-grab active:cursor-grabbing"
    >
      <!-- Cap -->
      <div class="absolute -top-2 w-6 h-2 bg-gray-400/80 rounded-t-sm"></div>
      <!-- Neck -->
      <div class="absolute -top-3 w-full h-4 flex justify-center">
        <div class="w-5 h-2 bg-gray-300/60"></div>
      </div>

      <!-- Liquid -->
      <div
        class="liquid w-full rounded-b-lg transition-all duration-300"
        :style="{ height: `${weight}%`, backgroundColor: liquidColor }"
      ></div>

      <!-- Reflection -->
      <div class="absolute top-2 left-1 w-1 h-1/2 bg-white/30 rounded-full"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  id: number;
  weight: number;
  color: string; // Tailwind class like 'bg-red-300'
}>();

const emit = defineEmits(['return-bottle']);

// A darker shade for the "liquid"
const liquidColor = computed(() => {
  if (props.color.includes('red')) return 'rgb(239 68 68)';
  if (props.color.includes('blue')) return 'rgb(59 130 246)';
  if (props.color.includes('green')) return 'rgb(34 197 94)';
  if (props.color.includes('purple')) return 'rgb(168 85 247)';
  if (props.color.includes('pink')) return 'rgb(236 72 153)';
  if (props.color.includes('indigo')) return 'rgb(99 102 241)';
  if (props.color.includes('yellow')) return 'rgb(234 179 8)';
  if (props.color.includes('teal')) return 'rgb(20 184 166)';
  return 'rgb(107 114 128)';
});
</script>

<style scoped>
.bottle-container {
  min-height: 80px; /* Ensure a minimum height for all bottles */
  transition: transform 0.2s ease-in-out, filter 0.2s ease-in-out;
}
.bottle-container:hover {
  transform: translateY(-8px) scale(1.05);
  filter: drop-shadow(0 10px 8px rgb(0 0 0 / 0.08))
    drop-shadow(0 4px 3px rgb(0 0 0 / 0.1));
}
.bottle {
  /* Use a transparent background to simulate glass */
  background-color: rgba(229, 231, 235, 0.3); /* bg-gray-200 with alpha */
}
</style>
