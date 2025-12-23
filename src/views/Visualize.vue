<template>
  <div class="min-h-screen bg-gray-50 text-gray-800">
    <div class="container mx-auto p-4 md:p-8">
      <h1
        class="text-4xl md:text-5xl font-extrabold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-teal-500"
      >
        Laboratorio de Ordenamiento
      </h1>

      <div class="flex flex-col gap-8">
        <!-- Fila Superior: Zona de Botellas Desordenadas -->
        <div
          class="bg-amber-100 border-2 border-amber-200 rounded-xl p-6 shadow-inner"
        >
          <h2 class="text-xl font-bold text-amber-800 mb-4">Mesa de Trabajo</h2>
          <div class="min-h-48 flex flex-wrap gap-4 items-end justify-center">
            <draggable
              v-model="workbenchBottles"
              :group="mainGroup"
              item-key="id"
              class="flex flex-wrap gap-4 justify-center items-end w-full min-h-[calc(100%-2rem)]"
              @change="logMovement"
            >
              <template #item="{ element: bottle }">
                <Bottle
                  :id="bottle.id"
                  :weight="bottle.weight"
                  :color="bottle.color"
                />
              </template>
            </draggable>
            <p
              v-if="workbenchBottles.length === 0"
              class="text-amber-700/50 w-full text-center text-lg italic"
            >
              Mesa de trabajo vacía
            </p>
          </div>
        </div>

        <!-- Fila Intermedia: Vacío, Balanza, Estadísticas -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- Columna Vacía -->
          <div class="hidden md:block"></div>

          <!-- Balanza de Comparación -->
          <div
            class="bg-white border border-gray-200 rounded-xl p-6 shadow-lg flex flex-col items-center justify-center"
          >
            <h2 class="text-2xl font-bold text-gray-700 mb-4">Balanza</h2>
            <div class="flex space-x-6 mb-6">
              <draggable
                v-model="leftPanBottle"
                :group="panGroup"
                item-key="id"
                class="w-24 h-24 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 transition-colors duration-300"
                @change="logMovement"
              >
                <template #item="{ element: bottle }">
                  <Bottle
                    :id="bottle.id"
                    :weight="bottle.weight"
                    :color="bottle.color"
                    :comparison="scaleResult.left"
                    @return-bottle="returnBottleFromPan"
                  />
                </template>
                <template #header v-if="leftPanBottle.length === 0">
                  <span class="text-sm">Platillo Izq.</span>
                </template>
              </draggable>
              <draggable
                v-model="rightPanBottle"
                :group="panGroup"
                item-key="id"
                class="w-24 h-24 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 transition-colors duration-300"
                @change="logMovement"
              >
                <template #item="{ element: bottle }">
                  <Bottle
                    :id="bottle.id"
                    :weight="bottle.weight"
                    :color="bottle.color"
                    :comparison="scaleResult.right"
                    @return-bottle="returnBottleFromPan"
                  />
                </template>
                <template #header v-if="rightPanBottle.length === 0">
                  <span class="text-sm">Platillo Der.</span>
                </template>
              </draggable>
            </div>
            <div v-if="!scaleWeighed">
              <button
                class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transform transition-transform duration-150 hover:scale-105 disabled:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:scale-100"
                :disabled="!canWeigh"
                @click="weighBottles"
              >
                PESAR
              </button>
            </div>
            <div v-else>
              <button
                class="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transform transition-transform duration-150 hover:scale-105"
                @click="resetScale"
              >
                RESETEAR
              </button>
            </div>
            <div
              v-if="comparisonMessage"
              class="mt-4 p-3 text-center text-sm bg-blue-100 text-blue-800 rounded-lg w-full"
            >
              {{ comparisonMessage }}
            </div>
          </div>

          <!-- Panel de Estadísticas -->
          <div class="bg-white border border-gray-200 rounded-xl shadow-lg p-6">
            <h2 class="text-2xl font-bold text-gray-700 mb-4">Estadísticas</h2>
            <ul class="space-y-3">
              <li class="flex items-center justify-between text-lg">
                <span class="text-gray-600">⚖️ Pesajes:</span>
                <span class="font-bold text-blue-600">{{ stats.pesajes }}</span>
              </li>
              <li class="flex items-center justify-between text-lg">
                <span class="text-gray-600">📦 Movimientos:</span>
                <span class="font-bold text-blue-600">{{ stats.movimientos }}</span>
              </li>
            </ul>
          </div>
        </div>

        <!-- Fila Inferior: Estantería Ordenada -->
        <div
          class="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-6 shadow-inner"
        >
          <h2 class="text-xl font-bold text-emerald-800 mb-4">Estantería Ordenada</h2>
          <div class="min-h-32 flex flex-wrap gap-4 items-end justify-center">
            <draggable
              v-model="sortedShelfBottles"
              :group="mainGroup"
              item-key="id"
              class="flex flex-wrap gap-4 justify-center items-end w-full min-h-[calc(100%-2rem)]"
              @change="logMovement"
            >
              <template #item="{ element: bottle }">
                <Bottle
                  :id="bottle.id"
                  :weight="bottle.weight"
                  :color="bottle.color"
                />
              </template>
            </draggable>
            <p
              v-if="sortedShelfBottles.length === 0"
              class="text-emerald-700/50 w-full text-center text-lg italic"
            >
              Estantería vacía
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import Bottle from '../components/Bottle.vue';
import draggable from 'vuedraggable';

// Define Bottle interface
interface Bottle {
  id: number;
  weight: number; // 1-100, representing fill level
  color: string; // Placeholder color
}

type ComparisonState = 'heavier' | 'lighter' | 'equal' | null;

// Function to generate random bottles
const generateRandomBottles = (count: number): Bottle[] => {
  const colors = [
    'bg-red-300',
    'bg-blue-300',
    'bg-green-300',
    'bg-purple-300',
    'bg-pink-300',
    'bg-indigo-300',
    'bg-yellow-300',
    'bg-teal-300',
  ];
  const bottles: Bottle[] = [];
  for (let i = 0; i < count; i++) {
    bottles.push({
      id: i + 1,
      weight: Math.floor(Math.random() * 100) + 1, // Weight from 1 to 100
      color: colors[i % colors.length]!, // Assign colors cyclically
    });
  }
  return bottles;
};

// Reactive state
const workbenchBottles = ref<Bottle[]>(generateRandomBottles(7));
const leftPanBottle = ref<Bottle[]>([]);
const rightPanBottle = ref<Bottle[]>([]);
const sortedShelfBottles = ref<Bottle[]>([]);
const comparisonMessage = ref<string | null>(null);
const scaleResult = ref<{ left: ComparisonState, right: ComparisonState }>({ left: null, right: null });
const scaleWeighed = ref(false); // New state to track if scale has been weighed

const stats = reactive({
  pesajes: 0,
  movimientos: 0,
});

// Drag-and-drop group configurations
const mainGroup = {
  name: 'bottles',
  pull: true,
  put: true,
};

const panGroup = computed(() => ({
  name: 'bottles',
  pull: true,
  put: (to: any) => {
    // Check if the scale has been weighed. If so, no more puts.
    if (scaleWeighed.value) return false;
    // Check if the pan is empty. vuedraggable's list has the items.
    // The target model (e.g., leftPanBottle) isn't updated yet when 'put' is evaluated.
    // We check the target Sortable instance's element to see how many bottles are visually in it.
    // It's 1 if empty (the #header template) and 2 if it has a bottle.
    const childrenCount = to.el.children.length;
    return childrenCount < 2;
  },
}));


// Computed property to enable/disable the PESAR button
const canWeigh = computed(
  () =>
    leftPanBottle.value.length === 1 && rightPanBottle.value.length === 1 && !scaleWeighed.value,
);

// Function to handle the @change event from draggable
const logMovement = (evt: any) => {
  if (evt.added) {
    stats.movimientos++;
  }
};

// Function to weigh bottles
const weighBottles = () => {
  if (!canWeigh.value) return;

  stats.pesajes++;
  scaleWeighed.value = true; // Set scale to weighed state

  const leftBottle = leftPanBottle.value[0];
  const rightBottle = rightPanBottle.value[0];

  if (!leftBottle || !rightBottle) return;

  let resultMessage = '';
  if (leftBottle.weight > rightBottle.weight) {
    scaleResult.value = { left: 'heavier', right: 'lighter' };
    resultMessage = 'El platillo izquierdo es más pesado.';
  } else if (rightBottle.weight > leftBottle.weight) {
    scaleResult.value = { left: 'lighter', right: 'heavier' };
    resultMessage = 'El platillo derecho es más pesado.';
  } else {
    scaleResult.value = { left: 'equal', right: 'equal' };
    resultMessage = 'Ambos platillos pesan lo mismo.';
  }

  comparisonMessage.value = resultMessage;
};

// Function to reset the scale
const resetScale = () => {
  const leftBottle = leftPanBottle.value[0];
  if (leftBottle) {
    workbenchBottles.value.push(leftBottle);
  }
  const rightBottle = rightPanBottle.value[0];
  if (rightBottle) {
    workbenchBottles.value.push(rightBottle);
  }

  leftPanBottle.value = [];
  rightPanBottle.value = [];
  scaleWeighed.value = false;
  comparisonMessage.value = null;
  scaleResult.value = { left: null, right: null };
};

// Function to return a bottle from a pan to the workbench on double-click
const returnBottleFromPan = (bottleId: number) => {
  const leftIndex = leftPanBottle.value.findIndex(b => b.id === bottleId);
  if (leftIndex !== -1) {
    const bottle = leftPanBottle.value.splice(leftIndex, 1)[0];
    if (bottle) {
      workbenchBottles.value.push(bottle);
      stats.movimientos++;
      // If we return a bottle, the scale is no longer in a valid 'weighed' state for that pair
      if(scaleWeighed.value) {
        resetScale(); // Resetting fully is a clean way to handle this
      }
    }
    return;
  }

  const rightIndex = rightPanBottle.value.findIndex(b => b.id === bottleId);
  if (rightIndex !== -1) {
    const bottle = rightPanBottle.value.splice(rightIndex, 1)[0];
    if (bottle) {
      workbenchBottles.value.push(bottle);
      stats.movimientos++;
      if(scaleWeighed.value) {
        resetScale();
      }
    }
  }
};
</script>

<style scoped></style>
