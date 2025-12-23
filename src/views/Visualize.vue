<template>
  <div class="container mx-auto p-4">
    <h1 class="text-3xl font-bold mb-6 text-center">Visualizar Algoritmos</h1>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Zona de Botellas Desordenadas (Workbench) -->
      <div
        class="md:col-span-2 bg-gray-100 border border-gray-300 rounded-lg p-4 min-h-64 flex flex-wrap gap-4 items-start justify-center"
      >
        <draggable
          v-model="workbenchBottles"
          group="bottles"
          item-key="id"
          class="flex flex-wrap gap-4 justify-center items-start w-full min-h-[calc(100%-2rem)]"
          @change="stats.movimientos++"
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
          class="text-gray-500 w-full text-center"
        >
          Zona de Botellas Desordenadas (vacía)
        </p>
      </div>

      <!-- Balanza de Comparación -->
      <div
        class="md:col-span-1 bg-yellow-50 border border-yellow-300 rounded-lg p-4 flex flex-col items-center justify-center"
      >
        <h2 class="text-xl font-semibold mb-4">Balanza de Comparación</h2>
        <div class="flex space-x-4 mb-4">
          <draggable
            v-model="leftPanBottle"
            group="bottles"
            item-key="id"
            class="w-20 h-20 bg-white border border-gray-200 rounded flex items-center justify-center text-gray-400"
            :move="checkPanCapacity"
            :data-pan-id="'left'"
            :max-items="1"
            @change="stats.movimientos++"
          >
            <template #item="{ element: bottle }">
              <Bottle
                :id="bottle.id"
                :weight="bottle.weight"
                :color="bottle.color"
              />
            </template>
            <template
              #header
              v-if="leftPanBottle.length === 0"
            >
              <span>Platillo Izq.</span>
            </template>
          </draggable>
          <draggable
            v-model="rightPanBottle"
            group="bottles"
            item-key="id"
            class="w-20 h-20 bg-white border border-gray-200 rounded flex items-center justify-center text-gray-400"
            :move="checkPanCapacity"
            :data-pan-id="'right'"
            :max-items="1"
            @change="stats.movimientos++"
          >
            <template #item="{ element: bottle }">
              <Bottle
                :id="bottle.id"
                :weight="bottle.weight"
                :color="bottle.color"
              />
            </template>
            <template
              #header
              v-if="rightPanBottle.length === 0"
            >
              <span>Platillo Der.</span>
            </template>
          </draggable>
        </div>
        <div v-if="!scaleWeighed">
          <button
            class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            :disabled="!canWeigh"
            @click="weighBottles"
          >
            PESAR
          </button>
        </div>
        <div v-else>
          <button
            class="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
            @click="resetScale"
          >
            RESETEAR BALANZA
          </button>
        </div>
        <div
          v-if="comparisonResult"
          class="mt-4 p-2 bg-blue-100 text-blue-800 rounded"
        >
          {{ comparisonResult }}
        </div>
      </div>

      <!-- Estantería Ordenada -->
      <div
        class="md:col-span-2 bg-green-50 border border-green-300 rounded-lg p-4 min-h-32 flex flex-wrap gap-4 items-start justify-center"
      >
        <draggable
          v-model="sortedShelfBottles"
          group="bottles"
          item-key="id"
          class="flex flex-wrap gap-4 justify-center items-start w-full min-h-[calc(100%-2rem)]"
          @change="stats.movimientos++"
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
          class="text-gray-500 w-full text-center"
        >
          Estantería Ordenada ✓
        </p>
      </div>

      <!-- Panel de Estadísticas -->
      <div class="md:col-span-1 bg-blue-50 border border-blue-300 rounded-lg p-4">
        <h2 class="text-xl font-semibold mb-4">📊 Estadísticas</h2>
        <p>⚖️ Pesajes: {{ stats.pesajes }}</p>
        <p>📦 Movimientos: {{ stats.movimientos }}</p>
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
      color: colors[i % colors.length], // Assign colors cyclically
    });
  }
  return bottles;
};

// Reactive state
const workbenchBottles = ref<Bottle[]>(generateRandomBottles(5));
const leftPanBottle = ref<Bottle[]>([]);
const rightPanBottle = ref<Bottle[]>([]);
const sortedShelfBottles = ref<Bottle[]>([]);
const comparisonResult = ref<string | null>(null);
const scaleWeighed = ref(false); // New state to track if scale has been weighed

const stats = reactive({
  pesajes: 0,
  movimientos: 0,
});

// Computed property to enable/disable the PESAR button
const canWeigh = computed(
  () =>
    leftPanBottle.value.length === 1 && rightPanBottle.value.length === 1 && !scaleWeighed.value,
);

// Function to check if a pan already has a bottle or if scale has been weighed
const checkPanCapacity = (evt: any) => {
  if (scaleWeighed.value) return false; // Prevent adding bottles after weighing
  const targetList = evt.to.__draggable_component__.list;
  return targetList.length === 0;
};

// Function to weigh bottles
const weighBottles = () => {
  if (!canWeigh.value) return;

  stats.pesajes++;
  scaleWeighed.value = true; // Set scale to weighed state

  const leftBottle = leftPanBottle.value[0];
  const rightBottle = rightPanBottle.value[0];

  let resultMessage = '';
  if (leftBottle.weight > rightBottle.weight) {
    resultMessage = `Botella ${leftBottle.id} es más pesada.`;
  } else if (rightBottle.weight > leftBottle.weight) {
    resultMessage = `Botella ${rightBottle.id} es más pesada.`;
  } else {
    resultMessage = `Ambas botellas tienen el mismo peso.`;
  }

  comparisonResult.value = resultMessage;
};

// Function to reset the scale
const resetScale = () => {
  if (leftPanBottle.value.length > 0) {
    workbenchBottles.value.push(leftPanBottle.value[0]);
  }
  if (rightPanBottle.value.length > 0) {
    workbenchBottles.value.push(rightPanBottle.value[0]);
  }

  leftPanBottle.value = [];
  rightPanBottle.value = [];
  scaleWeighed.value = false;
  comparisonResult.value = null;
};
</script>

<style scoped></style>
