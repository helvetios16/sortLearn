<template>
  <div
    class="bottle-container"
    :class="{
      'heavy-glow': comparison === 'heavier',
      'light-glow': comparison === 'lighter',
      'equal-glow': comparison === 'equal',
      consolidated: state === 'consolidated',
      comparing: state === 'comparing',
      'in-temp-var': state === 'temp-variable',
      'shake-hint': shouldShake,
      'opacity-40': dimmed,
    }"
    draggable="true"
    @click="emit('bottle-clicked', id)"
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

      <!-- Figuras geométricas en lugar de líquido -->
      <div
        class="w-full rounded-b-lg overflow-hidden relative"
        :style="{ height: liquidHeight }"
      >
        <div class="absolute inset-0 flex flex-wrap content-end justify-center gap-[1px] p-0.5">
          <template
            v-for="(shape, index) in shapes"
            :key="index"
          >
            <!-- Círculo -->
            <div
              v-if="shape.type === 'circle'"
              class="rounded-full transition-all duration-300"
              :style="{
                width: shape.size + 'px',
                height: shape.size + 'px',
                backgroundColor: shape.color,
              }"
            ></div>
            <!-- Cuadrado -->
            <div
              v-else-if="shape.type === 'square'"
              class="transition-all duration-300"
              :style="{
                width: shape.size + 'px',
                height: shape.size + 'px',
                backgroundColor: shape.color,
              }"
            ></div>
            <!-- Triángulo -->
            <div
              v-else-if="shape.type === 'triangle'"
              class="transition-all duration-300"
              :style="{
                width: '0',
                height: '0',
                borderLeft: shape.size / 2 + 'px solid transparent',
                borderRight: shape.size / 2 + 'px solid transparent',
                borderBottom: shape.size + 'px solid ' + shape.color,
              }"
            ></div>
          </template>
        </div>
      </div>

      <!-- Reflection -->
      <div class="absolute top-2 left-1 w-1 h-1/2 bg-white/30 rounded-full"></div>
    </div>

    <!-- Index label (shown when showIndex is true) -->
    <div
      v-if="showIndex !== undefined"
      class="index-label text-center mt-1 text-sm font-bold text-gray-600"
    >
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
  shouldShake?: boolean;
  dimmed?: boolean;
}>();

const emit = defineEmits(['return-bottle', 'bottle-clicked']);

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

  // Otherwise, show full height (85%) - all bottles appear full
  return '85%';
});

// Generate geometric shapes based on weight and id (for variety)
const shapes = computed(() => {
  const shapeTypes = ['circle', 'square', 'triangle'];
  const colors = [
    'rgb(239 68 68)', // red
    'rgb(59 130 246)', // blue
    'rgb(34 197 94)', // green
    'rgb(168 85 247)', // purple
    'rgb(236 72 153)', // pink
    'rgb(234 179 8)', // yellow
    'rgb(20 184 166)', // teal
  ];

  // Number of shapes based on weight (more shapes for denser look)
  const numShapes = Math.floor(props.weight / 2.5) + 8;

  const generatedShapes = [];
  for (let i = 0; i < numShapes; i++) {
    // Use weight and id for pseudo-random but consistent generation
    const seed = props.id * 1000 + props.weight + i;
    const typeIndex = (seed * 7) % shapeTypes.length;
    const colorIndex = (seed * 13) % colors.length;
    const size = 3 + ((seed * 3) % 4); // Size between 3-6px (smaller)

    generatedShapes.push({
      type: shapeTypes[typeIndex],
      color: colors[colorIndex],
      size: size,
    });
  }

  return generatedShapes;
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
  background: linear-gradient(
    to bottom,
    rgba(212, 248, 212, 0.4),
    rgba(168, 230, 168, 0.4)
  ) !important;
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
  0%,
  100% {
    border-color: #fbbf24;
    transform: scale(1);
  }
  50% {
    border-color: #f59e0b;
    transform: scale(1.05);
  }
}

.shake-hint {
  animation: shake-bottles 0.8s ease-in-out infinite;
}

@keyframes shake-bottles {
  0%,
  100% {
    transform: translateX(0) rotate(0deg);
  }
  25% {
    transform: translateX(-3px) rotate(-2deg);
  }
  75% {
    transform: translateX(3px) rotate(2deg);
  }
}

.index-label {
  user-select: none;
  pointer-events: none;
}
</style>
