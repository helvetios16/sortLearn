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
    <!-- FRASCO ORIGINAL: Estructura y Estilos IDÉNTICOS -->
    <div
      class="bottle relative w-12 h-20 border-2 border-gray-400/50 rounded-t-lg rounded-b-xl flex flex-col justify-end items-center cursor-grab active:cursor-grabbing"
      :class="{
        'bottle-consolidated': state === 'consolidated',
        'bottle-comparing': state === 'comparing',
      }"
    >
      <!-- Cap (Tapa original) -->
      <div class="absolute -top-2 w-6 h-2 bg-gray-400/80 rounded-t-sm"></div>
      <!-- Neck (Cuello original) -->
      <div class="absolute -top-3 w-full h-4 flex justify-center">
        <div class="w-5 h-2 bg-gray-300/60"></div>
      </div>

      <!-- CONTENIDO: Líquido en lugar de formas, dentro del contenedor original -->
      <div
        class="w-full rounded-b-lg overflow-hidden relative transition-all duration-700 ease-in-out"
        :style="{ height: liquidHeight }"
      >
        <!-- El Líquido -->
        <div
          class="absolute bottom-0 w-full h-full relative"
          :style="{ background: liquidGradient }"
        >
          <!-- Superficie del líquido -->
          <div class="absolute top-0 w-full h-[2px] bg-white/40 border-t border-white/20"></div>

          <!-- Burbujas (Densidad visual) -->
          <div class="bubbles-container absolute inset-0 overflow-hidden">
            <div
              v-for="n in 4"
              :key="n"
              class="bubble"
              :style="{
                left: `${20 * n}%`,
                animationDuration: `${3 + viscosity * n * 2}s`,
                opacity: 0.4 + (1 - viscosity) * 0.3,
              }"
            ></div>
          </div>
        </div>
      </div>

      <!-- Reflection (Reflejo original) -->
      <div
        class="absolute top-2 left-1 w-1 h-1/2 bg-white/30 rounded-full pointer-events-none"
      ></div>
    </div>

    <!-- Index label -->
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
  color: string;
  comparison?: 'heavier' | 'lighter' | 'equal' | null;
  state?: 'normal' | 'consolidated' | 'comparing' | 'temp-variable';
  showIndex?: number;
  shouldShake?: boolean;
  dimmed?: boolean;
}>();

const emit = defineEmits(['return-bottle', 'bottle-clicked']);

// Viscosidad basada en el peso (0.0 a 1.0)
const viscosity = computed(() => Math.min(1, Math.max(0, props.weight / 100)));

// Gradiente del Líquido (Colores y Densidad)
const liquidGradient = computed(() => {
  let rgb = '107, 114, 128'; // gray default

  if (props.color.includes('red')) rgb = '239, 68, 68';
  else if (props.color.includes('blue')) rgb = '59, 130, 246';
  else if (props.color.includes('green')) rgb = '34, 197, 94';
  else if (props.color.includes('purple')) rgb = '168, 85, 247';
  else if (props.color.includes('pink')) rgb = '236, 72, 153';
  else if (props.color.includes('indigo')) rgb = '99, 102, 241';
  else if (props.color.includes('yellow')) rgb = '234, 179, 8';
  else if (props.color.includes('teal')) rgb = '20, 184, 166';
  else if (props.color.includes('cyan')) rgb = '6, 182, 212';
  else if (props.color.includes('orange')) rgb = '249, 115, 22';
  else if (props.color.includes('stone') || props.color.includes('gray')) rgb = '120, 113, 108';

  // Más peso = Más opaco/denso
  const opacityBot = 0.4 + viscosity.value * 0.5;
  const opacityTop = 0.6 + viscosity.value * 0.35;

  return `linear-gradient(to top, rgba(${rgb}, ${opacityBot}) 0%, rgba(${rgb}, ${opacityTop}) 100%)`;
});

// Altura del Líquido (Proporcional al peso, rellenando el espacio disponible en el contenedor interior)
const liquidHeight = computed(() => {
  if (props.state === 'consolidated') {
    const percentage = Math.max(15, Math.min(100, props.weight));
    return `${percentage}%`;
  }
  // Rango visual dentro del contenedor interior (que ya respeta los bordes)
  // Dejamos un pequeño margen arriba siempre
  const percent = 20 + (props.weight / 100) * 80;
  return `${percent}%`;
});
</script>

<style scoped>
.bottle-container {
  min-height: 80px;
  transition:
    transform 0.2s ease-in-out,
    filter 0.2s ease-in-out;
}

.bottle-container:hover {
  transform: translateY(-8px) scale(1.05);
  filter: drop-shadow(0 10px 8px rgb(0 0 0 / 0.08)) drop-shadow(0 4px 3px rgb(0 0 0 / 0.1));
}

.bottle {
  /* Fondo original transparente/grisáceo */
  background-color: rgba(229, 231, 235, 0.3);
}

/* Animación de Burbujas */
.bubble {
  position: absolute;
  bottom: -5px;
  width: 3px;
  height: 3px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  animation: rise linear infinite;
}

@keyframes rise {
  0% {
    transform: translateY(0) scale(1);
    opacity: 0;
  }
  20% {
    opacity: 1;
  }
  100% {
    transform: translateY(-50px) scale(1.2);
    opacity: 0;
  }
}

/* Efectos de Resplandor Originales */
.heavy-glow {
  filter: drop-shadow(0 0 12px rgb(34 197 94 / 0.9));
}
.light-glow {
  filter: drop-shadow(0 0 12px rgb(239 68 68 / 0.9));
}
.equal-glow {
  filter: drop-shadow(0 0 12px rgb(59 130 246 / 0.9));
}

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
