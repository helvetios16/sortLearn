<template>
  <div
    class="bottle-container relative"
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
    <!-- Burbuja de mensaje -->
    <div v-if="message" class="message-bubble">
      {{ message }}
      <div class="message-arrow"></div>
    </div>
    <div
      class="bottle-image-container relative cursor-grab active:cursor-grabbing"
      :class="{
        'bottle-consolidated': state === 'consolidated',
        'bottle-comparing': state === 'comparing',
      }"
    >
      <!-- Imagen del frasco desde public -->
      <img
        :src="bottleImageSrc"
        :alt="`Frasco ${id}`"
        class="bottle-image"
      />
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
  message?: string; // Mensaje de burbuja para mostrar sobre el frasco
}>();

const emit = defineEmits(['return-bottle']);

// Computed property to get the bottle image source based on ID
// Maps bottle IDs (1-5) to corresponding images in public folder
const bottleImageSrc = computed(() => {
  // Cycle through the 5 available images (frasco1.png to frasco5.png)
  const imageNumber = ((props.id - 1) % 5) + 1;
  return `/frasco${imageNumber}.png`;
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

.bottle-image-container {
  width: 80px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.bottle-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: transform 0.2s ease-in-out, filter 0.2s ease-in-out;
}

.bottle-image-container:hover .bottle-image {
  transform: scale(1.05);
  filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1));
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

/* Burbuja de mensaje */
.message-bubble {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-bottom: 10px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 8px 12px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  white-space: nowrap;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 100;
  animation: bubble-appear 0.3s ease-out;
  max-width: 200px;
  white-space: normal;
  text-align: center;
  line-height: 1.3;
}

.message-arrow {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-top: 6px solid #764ba2;
}

@keyframes bubble-appear {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}
</style>
