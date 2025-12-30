<template>
  <div class="min-h-screen bg-gray-50 text-gray-800">
    <div class="container mx-auto p-4 md:p-8">
      <h1
        class="text-4xl md:text-5xl font-extrabold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-teal-500"
      >
        Laboratorio de Ordenamiento
      </h1>

      <div class="flex flex-col gap-8">
        <!-- Error/Success Messages -->
        <div v-if="errorMessage" class="bg-red-100 border-2 border-red-400 text-red-800 px-4 py-3 rounded-lg text-center font-semibold animate-shake">
          {{ errorMessage }}
        </div>
        <div v-if="successMessage" class="bg-green-100 border-2 border-green-400 text-green-800 px-4 py-3 rounded-lg text-center font-semibold">
          {{ successMessage }}
        </div>

        <!-- Fila Superior: Zona de Botellas Desordenadas -->
        <div class="bg-amber-100 border-2 border-amber-200 rounded-xl p-6 shadow-inner">
          <h2 class="text-xl font-bold text-amber-800 mb-4">Mesa de Trabajo (Desordenados)</h2>
          <div class="min-h-48 flex flex-wrap gap-4 items-end justify-center">
            <draggable
              v-model="workbenchBottles"
              :group="mainGroup"
              item-key="id"
              class="flex flex-wrap gap-4 justify-center items-end w-full min-h-[calc(100%-2rem)]"
              @change="logMovement"
            >
              <template #item="{ element: bottle, index }">
                <Bottle
                  :id="bottle.id"
                  :weight="bottle.weight"
                  :color="bottle.color"
                  :state="bottle.state"
                  :show-index="index"
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

        <!-- Fila Intermedia: Variable Temporal, Balanza, Estadísticas -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- Variable Temporal -->
          <div class="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-6 shadow-lg">
            <h2 class="text-xl font-bold text-yellow-800 mb-4">Variable Temporal</h2>
            <div class="flex flex-col items-center justify-center min-h-[200px]">
              <label class="text-sm font-mono text-yellow-700 mb-2">min_actual:</label>
              <div v-if="tempVariable" class="temp-variable-slot">
                <Bottle
                  :id="tempVariable.id"
                  :weight="tempVariable.weight"
                  :color="tempVariable.color"
                  state="temp-variable"
                />
                <p class="text-xs text-center mt-2 text-yellow-700 font-semibold">
                  Guardando el mínimo encontrado
                </p>
              </div>
              <div v-else class="text-center text-yellow-600/60 italic">
                <div class="w-16 h-24 border-2 border-dashed border-yellow-300 rounded-lg flex items-center justify-center mb-2">
                  <span class="text-2xl">?</span>
                </div>
                <p class="text-sm">Sin valor asignado</p>
              </div>
            </div>
          </div>

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
                class="w-24 h-24 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 transition-all duration-500"
                :class="{
                  'scale-pan-down': scaleResult.left === 'heavier',
                  'scale-pan-up': scaleResult.left === 'lighter',
                }"
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
                <template
                  #header
                  v-if="leftPanBottle.length === 0"
                >
                  <span class="text-sm">Platillo Izq.</span>
                </template>
              </draggable>
              <draggable
                v-model="rightPanBottle"
                :group="panGroup"
                item-key="id"
                class="w-24 h-24 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 transition-all duration-500"
                :class="{
                  'scale-pan-down': scaleResult.right === 'heavier',
                  'scale-pan-up': scaleResult.right === 'lighter',
                }"
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
                <template
                  #header
                  v-if="rightPanBottle.length === 0"
                >
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
              <li class="flex items-center justify-between text-lg">
                <span class="text-gray-600">🔢 Comparaciones:</span>
                <span class="font-bold text-purple-600">{{ stats.comparaciones }}</span>
              </li>
            </ul>
            <div class="mt-4 pt-4 border-t border-gray-200">
              <button
                @click="finishIteration"
                class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                :disabled="comparisonsInCurrentIteration === 0"
              >
                Terminar Iteración
              </button>
            </div>
          </div>
        </div>

        <!-- Panel de Historial de Iteraciones -->
        <div v-if="iterationHistory.length > 0" class="bg-slate-50 border-2 border-slate-200 rounded-xl p-6 shadow-inner">
          <h2 class="text-xl font-bold text-slate-800 mb-4">📜 Historial de Iteraciones</h2>
          <div class="space-y-2 max-h-48 overflow-y-auto">
            <div v-for="iteration in iterationHistory" :key="iteration.number" class="flex items-center gap-3 text-sm">
              <span class="font-semibold text-slate-700 min-w-[100px]">ITERACION {{ iteration.number }}:</span>
              <div class="flex-1 bg-slate-200 rounded-full h-6 flex items-center px-2">
                <div
                  class="bg-gradient-to-r from-blue-500 to-blue-600 h-4 rounded-full transition-all duration-300"
                  :style="{ width: `${Math.min(100, (iteration.comparisons / 10) * 100)}%` }"
                ></div>
              </div>
              <span class="text-slate-600 min-w-[150px]">({{ iteration.comparisons }} comparaciones) ✓</span>
            </div>
          </div>
          <div class="mt-4 pt-4 border-t border-slate-300 text-center">
            <span class="text-lg font-bold text-slate-700">Comparaciones acumuladas: </span>
            <span class="text-2xl font-extrabold text-blue-600">{{ stats.comparaciones }}</span>
          </div>
        </div>

        <!-- Fila Inferior: Estantería Ordenada -->
        <div class="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-6 shadow-inner">
          <h2 class="text-xl font-bold text-emerald-800 mb-4">Estantería Ordenada ✓</h2>
          <div class="min-h-32 flex flex-wrap gap-4 items-end justify-center">
            <draggable
              v-model="sortedShelfBottles"
              :group="mainGroup"
              item-key="id"
              class="flex flex-wrap gap-4 justify-center items-end w-full min-h-[calc(100%-2rem)]"
              @change="handleSortedShelfChange"
            >
              <template #item="{ element: bottle, index }">
                <Bottle
                  :id="bottle.id"
                  :weight="bottle.weight"
                  :color="bottle.color"
                  state="consolidated"
                  :show-index="index"
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
import { ref, reactive, computed, watch } from 'vue';
import Bottle from '../components/Bottle.vue';
import draggable from 'vuedraggable';

// Define Bottle interface
interface Bottle {
  id: number;
  weight: number; // 1-100, representing fill level
  color: string; // Placeholder color
  state?: 'normal' | 'consolidated' | 'comparing' | 'temp-variable';
}

type ComparisonState = 'heavier' | 'lighter' | 'equal' | null;

interface Iteration {
  number: number;
  comparisons: number;
  description: string;
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
const tempVariable = ref<Bottle | null>(null); // Variable temporal (min_actual)
const scaleResult = ref<{ left: ComparisonState; right: ComparisonState }>({
  left: null,
  right: null,
});
const scaleWeighed = ref(false); // New state to track if scale has been weighed

const stats = reactive({
  pesajes: 0,
  movimientos: 0,
  comparaciones: 0, // Total comparisons counter
});

const iterationHistory = ref<Iteration[]>([]);
const currentIteration = ref(0);
const comparisonsInCurrentIteration = ref(0);
const errorMessage = ref<string>('');
const successMessage = ref<string>('');

// Watch for changes in pans to auto-reset scale
watch(
  [leftPanBottle, rightPanBottle],
  ([newLeft, newRight], [oldLeft, oldRight]) => {
    // If the scale was in a 'weighed' state and a bottle is removed from either pan
    if (
      scaleWeighed.value &&
      (newLeft.length < oldLeft.length || newRight.length < oldRight.length)
    ) {
      // Partially reset the scale to allow a new comparison
      scaleWeighed.value = false;
      scaleResult.value = { left: null, right: null };
    }
  }
);

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
    leftPanBottle.value.length === 1 &&
    rightPanBottle.value.length === 1 &&
    !scaleWeighed.value
);

// Function to handle the @change event from draggable
const logMovement = (evt: any) => {
  if (evt.added) {
    stats.movimientos++;
  }
};

// Function to handle changes in sorted shelf with validation
const handleSortedShelfChange = (evt: { added?: { element: Bottle; newIndex: number } }) => {
  if (evt.added) {
    const addedBottle = evt.added.element as Bottle;
    const addedIndex = evt.added.newIndex;

    // Validate order
    if (addedIndex > 0) {
      const previousBottle = sortedShelfBottles.value[addedIndex - 1];
      if (previousBottle && addedBottle.weight < previousBottle.weight) {
        // Invalid order - remove the bottle and return it
        setTimeout(() => {
          sortedShelfBottles.value.splice(addedIndex, 1);
          workbenchBottles.value.push(addedBottle);
          showError(
            `❌ Orden incorrecto: La botella con peso ${addedBottle.weight} no puede ir después de una con peso ${previousBottle.weight}`
          );
        }, 100);
        return;
      }
    }

    // Valid placement
    addedBottle.state = 'consolidated';
    stats.movimientos++;
    showSuccess(`✓ Botella colocada correctamente en la estantería`);
  }
};

// Function to weigh bottles
const weighBottles = () => {
  if (!canWeigh.value) return;

  stats.pesajes++;
  stats.comparaciones++;
  comparisonsInCurrentIteration.value++;
  scaleWeighed.value = true; // Set scale to weighed state

  const leftBottle = leftPanBottle.value[0];
  const rightBottle = rightPanBottle.value[0];

  if (!leftBottle || !rightBottle) return;

  // Update bottle states to show they're being compared
  leftBottle.state = 'comparing';
  rightBottle.state = 'comparing';

  if (leftBottle.weight > rightBottle.weight) {
    scaleResult.value = { left: 'heavier', right: 'lighter' };
  } else if (rightBottle.weight > leftBottle.weight) {
    scaleResult.value = { left: 'lighter', right: 'heavier' };
  } else {
    scaleResult.value = { left: 'equal', right: 'equal' };
  }
};

// Function to reset the scale
const resetScale = () => {
  const leftBottle = leftPanBottle.value[0];
  if (leftBottle) {
    leftBottle.state = 'normal';
    workbenchBottles.value.push(leftBottle);
  }
  const rightBottle = rightPanBottle.value[0];
  if (rightBottle) {
    rightBottle.state = 'normal';
    workbenchBottles.value.push(rightBottle);
  }

  leftPanBottle.value = [];
  rightPanBottle.value = [];
  scaleWeighed.value = false;
  scaleResult.value = { left: null, right: null };
};

// Function to finish current iteration and start a new one
const finishIteration = () => {
  if (comparisonsInCurrentIteration.value > 0) {
    currentIteration.value++;
    iterationHistory.value.push({
      number: currentIteration.value,
      comparisons: comparisonsInCurrentIteration.value,
      description: `Iteración ${currentIteration.value}`,
    });
    comparisonsInCurrentIteration.value = 0;
  }
};

// Function to validate and add bottle to sorted shelf
const validateSortedShelfPlacement = (bottle: Bottle): boolean => {
  if (sortedShelfBottles.value.length === 0) return true;

  const lastBottle = sortedShelfBottles.value[sortedShelfBottles.value.length - 1];
  if (!lastBottle) return true;

  if (bottle.weight < lastBottle.weight) {
    showError(
      `❌ Esta botella (peso: ${bottle.weight}) no puede ir después de una más pesada (peso: ${lastBottle.weight})`
    );
    return false;
  }

  return true;
};

// Show error message temporarily
const showError = (message: string) => {
  errorMessage.value = message;
  setTimeout(() => {
    errorMessage.value = '';
  }, 3000);
};

// Show success message temporarily
const showSuccess = (message: string) => {
  successMessage.value = message;
  setTimeout(() => {
    successMessage.value = '';
  }, 2000);
};

// Function to return a bottle from a pan to the workbench on double-click
const returnBottleFromPan = (bottleId: number) => {
  const leftIndex = leftPanBottle.value.findIndex((b) => b.id === bottleId);
  if (leftIndex !== -1) {
    const bottle = leftPanBottle.value.splice(leftIndex, 1)[0];
    if (bottle) {
      workbenchBottles.value.push(bottle);
      stats.movimientos++;
    }
    return;
  }

  const rightIndex = rightPanBottle.value.findIndex((b) => b.id === bottleId);
  if (rightIndex !== -1) {
    const bottle = rightPanBottle.value.splice(rightIndex, 1)[0];
    if (bottle) {
      workbenchBottles.value.push(bottle);
      stats.movimientos++;
    }
  }
};
</script>

<style scoped>
.scale-pan-up {
  transform: translateY(-12px);
}
.scale-pan-down {
  transform: translateY(12px);
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
  20%, 40%, 60%, 80% { transform: translateX(10px); }
}

.animate-shake {
  animation: shake 0.5s;
}
</style>
