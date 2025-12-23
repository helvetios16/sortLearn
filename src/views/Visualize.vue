<template>
  <div class="container mx-auto p-4">
    <h1 class="text-3xl font-bold mb-6 text-center">Visualizar Algoritmos</h1>

    <div class="flex flex-col gap-6">
      <!-- Fila Superior: Zona de Botellas Desordenadas -->
      <div
        class="bg-gray-100 border border-gray-300 rounded-lg p-4 min-h-64 flex flex-wrap gap-4 items-start justify-center"
      >
        <draggable
          v-model="workbenchBottles"
          :group="mainGroup"
          item-key="id"
          class="flex flex-wrap gap-4 justify-center items-start w-full min-h-[calc(100%-2rem)]"
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
          class="text-gray-500 w-full text-center"
        >
          Zona de Botellas Desordenadas (vacía)
        </p>
      </div>

      <!-- Fila Intermedia: Vacío, Balanza, Estadísticas -->
      <div class="grid grid-cols-3 gap-6">
        <!-- Columna Vacía -->
        <div></div>

        <!-- Balanza de Comparación -->
        <div
          class="bg-yellow-50 border border-yellow-300 rounded-lg p-4 flex flex-col items-center justify-center"
        >
          <h2 class="text-xl font-semibold mb-4">Balanza de Comparación</h2>
          <div class="flex space-x-4 mb-4">
            <draggable
              v-model="leftPanBottle"
              :group="panGroup"
              item-key="id"
              class="w-20 h-20 bg-white border border-gray-200 rounded flex items-center justify-center text-gray-400"
              @change="logMovement"
            >
              <template #item="{ element: bottle }">
                <Bottle
                  :id="bottle.id"
                  :weight="bottle.weight"
                  :color="bottle.color"
                  @return-bottle="returnBottleFromPan"
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
              :group="panGroup"
              item-key="id"
              class="w-20 h-20 bg-white border border-gray-200 rounded flex items-center justify-center text-gray-400"
              @change="logMovement"
            >
              <template #item="{ element: bottle }">
                <Bottle
                  :id="bottle.id"
                  :weight="bottle.weight"
                  :color="bottle.color"
                  @return-bottle="returnBottleFromPan"
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

        <!-- Panel de Estadísticas -->
        <div class="bg-blue-50 border border-blue-300 rounded-lg p-4">
          <h2 class="text-xl font-semibold mb-4">📊 Estadísticas</h2>
          <p>⚖️ Pesajes: {{ stats.pesajes }}</p>
          <p>📦 Movimientos: {{ stats.movimientos }}</p>
        </div>
      </div>

      <!-- Fila Inferior: Estantería Ordenada -->
      <div
        class="bg-green-50 border border-green-300 rounded-lg p-4 min-h-32 flex flex-wrap gap-4 items-start justify-center"
      >
        <draggable
          v-model="sortedShelfBottles"
          :group="mainGroup"
          item-key="id"
          class="flex flex-wrap gap-4 justify-center items-start w-full min-h-[calc(100%-2rem)]"
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
          class="text-gray-500 w-full text-center"
        >
          Estantería Ordenada ✓
        </p>
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
const workbenchBottles = ref<Bottle[]>(generateRandomBottles(7));
const leftPanBottle = ref<Bottle[]>([]);
const rightPanBottle = ref<Bottle[]>([]);
const sortedShelfBottles = ref<Bottle[]>([]);
const comparisonResult = ref<string | null>(null);
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

// Function to return a bottle from a pan to the workbench on double-click
const returnBottleFromPan = (bottleId: number) => {
  const leftIndex = leftPanBottle.value.findIndex(b => b.id === bottleId);
  if (leftIndex !== -1) {
    const bottle = leftPanBottle.value.splice(leftIndex, 1)[0];
    workbenchBottles.value.push(bottle);
    stats.movimientos++;
    // If we return a bottle, the scale is no longer in a valid 'weighed' state for that pair
    if(scaleWeighed.value) {
      resetScale(); // Resetting fully is a clean way to handle this
    }
    return;
  }

  const rightIndex = rightPanBottle.value.findIndex(b => b.id === bottleId);
  if (rightIndex !== -1) {
    const bottle = rightPanBottle.value.splice(rightIndex, 1)[0];
    workbenchBottles.value.push(bottle);
    stats.movimientos++;
    if(scaleWeighed.value) {
      resetScale();
    }
  }
};
</script>

<style scoped></style>
