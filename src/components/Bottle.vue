<template>
  <div
    class="bottle-container"
    :class="{
      'heavy-glow': comparison === 'heavier',
      'light-glow': comparison === 'lighter',
      'equal-glow': comparison === 'equal',
      'consolidated': state === 'consolidated',
      'comparing': state === 'comparing',
      'in-temp-var': state === 'temp-variable',
    }"
    @dblclick="emit('return-bottle', id)"
  >
    <div
      class="bottle relative w-12 h-20 border-2 border-gray-400/50 rounded-t-lg rounded-b-xl flex flex-col justify-end items-center cursor-grab active:cursor-grabbing"
      :class="{
        'bottle-consolidated': state === 'consolidated',
        'bottle-comparing': state === 'comparing',
      }"
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
        :style="{ height: liquidHeight, backgroundColor: liquidColor }"
      ></div>

      <!-- Reflection -->
      <div class="absolute top-2 left-1 w-1 h-1/2 bg-white/30 rounded-full"></div>
    </div>

    <!-- Index label (shown when showIndex is true) -->
    <div v-if="showIndex !== undefined" class="index-label text-center mt-1 text-sm font-bold text-gray-600">
      {{ showIndex }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  id: number;
  weight: number;
  color: string; // Tailwind class like 'bg-red-300'
  comparison?: 'heavier' | 'lighter' | 'equal' | null;
  state?: 'normal' | 'consolidated' | 'comparing' | 'temp-variable';
  showIndex?: number;
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

// Calculate liquid height based on state
const liquidHeight = computed(() => {
  // If consolidated (in sorted array), show actual weight proportionally
  if (props.state === 'consolidated') {
    const percentage = Math.max(10, Math.min(90, props.weight));
    return `${percentage}%`;
  }

  // Otherwise, show uniform height (50%) to hide the actual weight
  return '50%';
});
</script>

<style scoped>
.bottle-container {
  min-height: 80px;
  /* Ensure a minimum height for all bottles */
  transition:
    transform 0.2s ease-in-out,
    filter 0.2s ease-in-out;
}

.bottle-container:hover {
  transform: translateY(-8px) scale(1.05);
  filter: drop-shadow(0 10px 8px rgb(0 0 0 / 0.08)) drop-shadow(0 4px 3px rgb(0 0 0 / 0.1));
}

.bottle {
  /* Use a transparent background to simulate glass */
  background-color: rgba(229, 231, 235, 0.3);
  /* bg-gray-200 with alpha */
}

/* Glow effects for comparison */
.heavy-glow {
  filter: drop-shadow(0 0 12px rgb(34 197 94 / 0.9));
  /* green glow */
}

.light-glow {
  filter: drop-shadow(0 0 12px rgb(239 68 68 / 0.9));
  /* red glow */
}

.equal-glow {
  filter: drop-shadow(0 0 12px rgb(59 130 246 / 0.9));
  /* blue glow */
}

/* State-based styles */
.consolidated {
  filter: drop-shadow(0 0 20px rgba(34, 197, 94, 0.6));
}

.bottle-consolidated {
  background: linear-gradient(to bottom, rgba(212, 248, 212, 0.4), rgba(168, 230, 168, 0.4)) !important;
  pointer-events: none;
}

.comparing {
  animation: pulse-border 1.5s ease-in-out infinite;
}

.bottle-comparing {
  border: 3px solid #fbbf24 !important;
  border-width: 3px !important;
}

.in-temp-var {
  filter: drop-shadow(0 0 16px rgba(251, 191, 36, 0.8));
}

@keyframes pulse-border {
  0%, 100% {
    border-color: #fbbf24;
    transform: scale(1);
  }
  50% {
    border-color: #f59e0b;
    transform: scale(1.05);
  }
}

.index-label {
  user-select: none;
  pointer-events: none;
}
</style>
