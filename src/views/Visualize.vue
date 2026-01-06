<template>
  <div class="min-h-screen bg-gray-50 text-gray-800">
    <div class="container mx-auto p-4 md:p-8">
      <h1
        class="text-3xl md:text-4xl font-extrabold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-teal-500"
      >
        Laboratorio de Ordenamiento
      </h1>

      <div class="flex flex-col gap-6">
        <!-- Error/Success Messages -->
        <div v-if="errorMessage" class="bg-red-100 border-2 border-red-400 text-red-800 px-4 py-3 rounded-lg text-center font-semibold animate-shake">
          {{ errorMessage }}
        </div>
        <div v-if="successMessage" class="bg-green-100 border-2 border-green-400 text-green-800 px-4 py-3 rounded-lg text-center font-semibold">
          {{ successMessage }}
        </div>

        <!-- Fila Superior: Zona de Botellas Desordenadas (Array Visual) -->
        <div class="bg-amber-100 border-2 border-amber-200 rounded-xl p-3 shadow-inner">
          <div class="flex items-center justify-center gap-3">
            <h2 class="text-xl font-bold text-blue-600 whitespace-nowrap">
              DESORDENADOS[]
            </h2>
            <!-- Array estático con 5 posiciones siempre visibles -->
            <div class="inline-flex border-4 border-blue-400 rounded-lg bg-white/50 p-1.5">
                <div v-for="index in 5" :key="index" class="array-slot">
                <!-- Cada slot tiene su propio draggable -->
                <draggable
                  :model-value="getBottleAtPosition(index - 1) ? [getBottleAtPosition(index - 1)] : []"
                  @update:model-value="(bottles) => updateBottleAtPosition(index - 1, bottles)"
                  :group="mainGroup"
                  item-key="id"
                  class="flex items-end justify-center min-h-[80px]"
                >
                  <template #item="{ element: bottle }">
                    <Bottle
                      v-if="bottle"
                      :id="bottle.id"
                      :weight="bottle.weight"
                      :color="bottle.color"
                      :state="bottle.state"
                    />
                  </template>
                  <template #header>
                    <div v-if="!getBottleAtPosition(index - 1)" class="empty-slot">
                      <div class="w-12 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50/50">
                        <span class="text-gray-400 text-xs">vacío</span>
                      </div>
                    </div>
                  </template>
                </draggable>
                <!-- Índice siempre visible -->
                <div class="index-box">
                  {{ index - 1 }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Fila Intermedia: Variable Temporal, Balanza, Estadísticas -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Variable Temporal -->
          <div class="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-4 shadow-lg">
            <h2 class="text-lg font-bold text-yellow-800 mb-3 text-center">
              <div>VARIABLE TEMPORAL</div>
              <div class="font-mono text-yellow-700">min_actual</div>
            </h2>
            <div class="flex flex-col items-center justify-center min-h-[180px]">
              <draggable
                v-model="tempVariableArray"
                :group="mainGroup"
                item-key="id"
                class="w-full flex justify-center items-center min-h-[120px]"
                @change="handleTempVariableChange"
              >
                <template #item="{ element: bottle }">
                  <div class="temp-variable-slot">
                    <Bottle
                      :id="bottle.id"
                      :weight="bottle.weight"
                      :color="bottle.color"
                      state="temp-variable"
                      @return-bottle="returnBottleFromTemp"
                    />
                    <div class="mt-3 p-2 bg-yellow-100 border border-yellow-400 rounded-lg">
                      <p class="text-xs text-center text-yellow-800 font-bold">
                        🏆 Mínimo encontrado
                      </p>
                      <p class="text-xs text-center text-yellow-700 mt-1">
                        Iteración {{ currentIteration + 1 }}
                      </p>
                    </div>
                  </div>
                </template>
                <template #header v-if="tempVariableArray.length === 0">
                  <div class="text-center text-yellow-600/60 italic">
                    <div class="w-16 h-24 border-2 border-dashed border-yellow-300 rounded-lg flex items-center justify-center mb-2 mx-auto">
                      <span class="text-2xl">?</span>
                    </div>
                    <p class="text-sm">Sin valor asignado</p>
                    <p class="text-xs mt-1">Compara elementos para encontrar el mínimo</p>
                  </div>
                </template>
              </draggable>
            </div>
          </div>

          <!-- Balanza de Comparación -->
          <div
            class="bg-white border border-gray-200 rounded-xl p-4 shadow-lg flex flex-col items-center justify-center"
          >
            <h2 class="text-lg font-bold text-gray-700 mb-3">BALANZA DE COMPARACIÓN</h2>

            <!-- Estructura de la balanza física -->
            <div class="relative w-full h-48 flex flex-col items-center justify-end">
              <!-- Base de la balanza -->
              <div class="absolute bottom-0 w-32 h-3 bg-gradient-to-b from-gray-400 to-gray-500 rounded-sm shadow-md"></div>

              <!-- Soporte vertical central (sin la línea) -->
              <div class="absolute bottom-3 w-3 h-28 bg-gradient-to-r from-gray-500 via-gray-400 to-gray-500 shadow-lg rounded-t-sm"></div>

              <!-- Punto de apoyo (fulcro) -->
              <div class="absolute bottom-28 w-6 h-6 bg-gray-600 rounded-full border-2 border-gray-700 shadow-lg z-20"></div>

              <!-- Barra horizontal (se inclina según el peso) -->
              <div
                class="absolute bottom-28 w-64 h-2 bg-gradient-to-r from-gray-500 via-gray-400 to-gray-500 rounded-full shadow-lg transition-transform duration-700 origin-center"
                :style="{
                  transform: scaleResult.left === 'heavier' ? 'rotate(-8deg)' :
                             scaleResult.right === 'heavier' ? 'rotate(8deg)' :
                             'rotate(0deg)'
                }"
              ></div>

              <!-- Platillos (sin cadenas visibles) -->
              <div class="absolute bottom-28 w-full flex justify-between px-4">
                <!-- Platillo izquierdo -->
                <div class="flex flex-col items-center transition-all duration-700" :style="{
                  transform: scaleResult.left === 'heavier' ? 'translateY(20px)' :
                             scaleResult.left === 'lighter' ? 'translateY(-20px)' :
                             'translateY(0px)'
                }">
                  <!-- Plato visual (ovalado/triangular) -->
                  <div class="w-20 h-5 rounded-full bg-gradient-to-b from-gray-200 via-gray-300 to-gray-400 border-2 border-black shadow-xl" style="border-radius: 50%; transform: perspective(100px) rotateX(60deg);"></div>

                  <!-- Área draggable encima del plato -->
                  <draggable
                    v-model="leftPanBottle"
                    :group="panGroup"
                    item-key="id"
                    class="absolute -top-14 flex items-center justify-center min-h-[60px] min-w-[80px]"
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
                  </draggable>
                </div>

                <!-- Platillo derecho -->
                <div class="flex flex-col items-center transition-all duration-700" :style="{
                  transform: scaleResult.right === 'heavier' ? 'translateY(20px)' :
                             scaleResult.right === 'lighter' ? 'translateY(-20px)' :
                             'translateY(0px)'
                }">
                  <!-- Plato visual (ovalado/triangular) -->
                  <div class="w-20 h-5 rounded-full bg-gradient-to-b from-gray-200 via-gray-300 to-gray-400 border-2 border-black shadow-xl" style="border-radius: 50%; transform: perspective(100px) rotateX(60deg);"></div>

                  <!-- Área draggable encima del plato -->
                  <draggable
                    v-model="rightPanBottle"
                    :group="panGroup"
                    item-key="id"
                    class="absolute -top-14 flex items-center justify-center min-h-[60px] min-w-[80px]"
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
                  </draggable>
                </div>
              </div>
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

          <!-- Panel de Progreso del Algoritmo Selection Sort -->
          <div class="bg-slate-50 border-2 border-slate-200 rounded-xl shadow-lg p-4">
            <h2 class="text-lg font-bold text-slate-800 mb-3 text-center">
              <div>PROGRESO DEL ALGORITMO</div>
              <div class="font-mono text-slate-700">SELECTION SORT</div>
            </h2>

            <div class="space-y-1 max-h-48 overflow-y-auto mb-4">
              <!-- Mostrar todas las iteraciones (completadas, actual, y pendientes) -->
              <div v-for="iterNum in totalIterations" :key="iterNum" class="flex items-center gap-2 text-xs font-mono">
                <span
                  class="font-bold min-w-[85px]"
                  :class="{
                    'text-slate-700': iterNum <= currentIteration,
                    'text-yellow-700': iterNum === currentIteration + 1 && comparisonsInCurrentIteration > 0,
                    'text-slate-400': iterNum > currentIteration + 1 || (iterNum === currentIteration + 1 && comparisonsInCurrentIteration === 0)
                  }"
                >
                  ITERACION {{ iterNum }}:
                </span>
                <div class="flex gap-0">
                  <!-- Iteración completada -->
                  <template v-if="iterNum <= currentIteration">
                    <span v-for="i in getIterationComparisons(iterNum)" :key="i" class="text-slate-600">█</span>
                  </template>
                  <!-- Iteración actual en progreso -->
                  <template v-else-if="iterNum === currentIteration + 1">
                    <span v-for="i in comparisonsInCurrentIteration" :key="i" class="text-yellow-600">█</span>
                    <span v-for="i in (expectedComparisonsForIteration(iterNum) - comparisonsInCurrentIteration)" :key="'empty-' + i" class="text-slate-300">█</span>
                  </template>
                  <!-- Iteraciones pendientes -->
                  <template v-else>
                    <span v-for="i in expectedComparisonsForIteration(iterNum)" :key="i" class="text-slate-300">█</span>
                  </template>
                </div>
                <span
                  class="ml-1 text-xs"
                  :class="{
                    'text-slate-500': iterNum <= currentIteration,
                    'text-yellow-600': iterNum === currentIteration + 1 && comparisonsInCurrentIteration > 0,
                    'text-slate-400': iterNum > currentIteration + 1 || (iterNum === currentIteration + 1 && comparisonsInCurrentIteration === 0)
                  }"
                >
                  {{ iterNum <= currentIteration ? `(${getIterationComparisons(iterNum)} comparaciones) ✓` :
                     iterNum === currentIteration + 1 && comparisonsInCurrentIteration > 0 ? `(${comparisonsInCurrentIteration}/${expectedComparisonsForIteration(iterNum)})` :
                     `(${expectedComparisonsForIteration(iterNum)} comparaciones)` }}
                </span>
              </div>
            </div>

            <div class="pt-3 border-t border-slate-300">
              <div class="text-center mb-3">
                <span class="text-sm font-semibold text-slate-700">Comparaciones totales: </span>
                <span class="text-2xl font-extrabold text-blue-600">{{ stats.comparaciones }}</span>
              </div>

              <!-- Mensaje de estado y botón de reinicio -->
              <div v-if="currentIteration >= totalIterations" class="space-y-2">
                <div class="text-center text-sm text-green-600 font-semibold py-2">
                  🎉 ¡Proceso completado!
                </div>
                <button
                  @click="resetAlgorithm"
                  class="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <span>✅</span>
                  <span>TERMINAR PROCESO</span>
                </button>
              </div>
              <div v-else class="space-y-2">
                <div class="text-center text-sm text-slate-500 italic py-2">
                  Continúa comparando elementos en la balanza...
                </div>
                <button
                  @click="resetAlgorithm"
                  class="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <span>🔄</span>
                  <span>REINICIAR PROCESO</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Fila Inferior: Estantería Ordenada (Array Visual) -->
        <div class="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-3 shadow-inner">
          <div class="flex items-center justify-center gap-3">
            <h2 class="text-xl font-bold text-blue-600 whitespace-nowrap">
              ORDENADOS[]
            </h2>
            <!-- Array estático de 5 posiciones para elementos ordenados -->
            <div class="inline-flex border-4 border-green-500 rounded-lg bg-white/50 p-1.5">
                <div v-for="index in 5" :key="index" class="array-slot">
                <!-- Cada slot de la zona ordenada -->
                <draggable
                  :model-value="getSortedBottleAtPosition(index - 1) ? [getSortedBottleAtPosition(index - 1)] : []"
                  @update:model-value="(bottles) => handleSortedShelfChange({ added: bottles.length > 0 ? { element: bottles[0], newIndex: index - 1 } : undefined })"
                  :group="sortedGroup"
                  item-key="id"
                  class="flex items-end justify-center min-h-[80px]"
                >
                  <template #item="{ element: bottle }">
                    <Bottle
                      v-if="bottle"
                      :id="bottle.id"
                      :weight="bottle.weight"
                      :color="bottle.color"
                      state="consolidated"
                    />
                  </template>
                  <template #header>
                    <div v-if="!getSortedBottleAtPosition(index - 1)" class="empty-slot">
                      <div class="w-12 h-20 border-2 border-dashed border-green-300 rounded-lg flex items-center justify-center bg-green-50/50">
                        <span class="text-green-400 text-xs">vacío</span>
                      </div>
                    </div>
                  </template>
                </draggable>
                <!-- Índice siempre visible -->
                <div class="index-box index-box-sorted">
                  {{ index - 1 }}
                </div>
              </div>
            </div>
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
  const bottles: Bottle[] = [];
  for (let i = 0; i < count; i++) {
    bottles.push({
      id: i + 1,
      weight: Math.floor(Math.random() * 100) + 1, // Weight from 1 to 100
      color: 'bg-blue-300', // All bottles same color (blue)
    });
  }
  return bottles;
};

// Reactive state - Array estático de 5 posiciones (puede tener nulls)
const workbenchBottles = ref<(Bottle | null)[]>([...generateRandomBottles(5)]);
const leftPanBottle = ref<Bottle[]>([]);
const rightPanBottle = ref<Bottle[]>([]);
const sortedShelfBottles = ref<(Bottle | null)[]>([null, null, null, null, null]); // Array estático de 5 posiciones
const tempVariableArray = ref<Bottle[]>([]); // Variable temporal (min_actual) as array for draggable

// Helper function to get bottle at specific position in workbench
const getBottleAtPosition = (index: number): Bottle | null => {
  return workbenchBottles.value[index] || null;
};

// Helper function to get bottle at specific position in sorted shelf
const getSortedBottleAtPosition = (index: number): Bottle | null => {
  return sortedShelfBottles.value[index] || null;
};

// Helper function to update bottle at specific position in workbench
const updateBottleAtPosition = (index: number, bottles: Bottle[]) => {
  if (bottles.length > 0) {
    // Se agregó una botella a esta posición
    workbenchBottles.value[index] = bottles[0] ?? null;
    stats.movimientos++;
  } else {
    // Se quitó una botella de esta posición
    workbenchBottles.value[index] = null;
  }
};
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
const currentMinBottle = ref<Bottle | null>(null); // Tracks the minimum bottle found in current iteration

// Computed: Total iterations for Selection Sort (n-1 for n elements)
const totalIterations = computed(() => {
  const initialBottles = 5; // We start with 5 bottles
  return initialBottles - 1; // Selection Sort needs n-1 iterations
});

// Computed: Expected comparisons for each iteration (decreases by 1 each iteration)
const expectedComparisonsForIteration = (iterNum: number): number => {
  const initialBottles = 5;
  return initialBottles - iterNum; // Iteration 1: 4 comparisons, Iteration 2: 3, etc.
};

// Function to get comparisons from iteration history
const getIterationComparisons = (iterNum: number): number => {
  const iteration = iterationHistory.value.find(it => it.number === iterNum);
  return iteration ? iteration.comparisons : 0;
};

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

// Group configuration for sorted shelf (no pull allowed to maintain array structure)
const sortedGroup = {
  name: 'bottles',
  pull: false, // No permitir sacar elementos de la zona ordenada
  put: true, // Permitir agregar (aunque lo bloqueamos con validación)
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

// Function to handle changes in temp variable zone
const handleTempVariableChange = (evt: { added?: { element: Bottle } }) => {
  if (evt.added) {
    const addedBottle = evt.added.element as Bottle;

    // Only allow one bottle in temp variable
    if (tempVariableArray.value.length > 1) {
      setTimeout(() => {
        const extraBottle = tempVariableArray.value.pop();
        if (extraBottle) {
          workbenchBottles.value.push(extraBottle);
          showError('⚠️ La variable min_actual solo puede almacenar UN elemento (el mínimo de la iteración actual)');
        }
      }, 100);
      return;
    }

    addedBottle.state = 'temp-variable';
    currentMinBottle.value = addedBottle;
    stats.movimientos++;
    showSuccess(`📝 Elemento guardado en min_actual. Usa la balanza para comparar y encontrar el mínimo real`);
  }
};

// Function to return bottle from temp variable on double-click
const returnBottleFromTemp = (bottleId: number) => {
  const index = tempVariableArray.value.findIndex((b) => b.id === bottleId);
  if (index !== -1) {
    const bottle = tempVariableArray.value.splice(index, 1)[0];
    if (bottle) {
      bottle.state = 'normal';
      const emptyIndex = workbenchBottles.value.findIndex(b => b === null);
      if (emptyIndex !== -1) {
        workbenchBottles.value[emptyIndex] = bottle;
      }
      currentMinBottle.value = null;
      stats.movimientos++;
    }
  }
};

// Function to handle changes in sorted shelf with validation
const handleSortedShelfChange = (evt: { added?: { element: Bottle; newIndex: number } }) => {
  if (evt.added) {
    const addedBottle = evt.added.element as Bottle;
    const addedIndex = evt.added.newIndex;

    // Prevenir colocación manual - el sistema debe hacerlo automáticamente
    setTimeout(() => {
      sortedShelfBottles.value.splice(addedIndex, 1);
      const emptyIndex = workbenchBottles.value.findIndex(b => b === null);
      if (emptyIndex !== -1) {
        workbenchBottles.value[emptyIndex] = addedBottle;
      }
      addedBottle.state = 'normal';
      showError(
        `⚠️ No puedes mover elementos directamente a ORDENADOS[]. El sistema lo hace automáticamente al terminar cada iteración`
      );
    }, 100);
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

  let lighterBottle: Bottle;
  let heavierBottle: Bottle;

  if (leftBottle.weight > rightBottle.weight) {
    scaleResult.value = { left: 'heavier', right: 'lighter' };
    lighterBottle = rightBottle;
    heavierBottle = leftBottle;
  } else if (rightBottle.weight > leftBottle.weight) {
    scaleResult.value = { left: 'lighter', right: 'heavier' };
    lighterBottle = leftBottle;
    heavierBottle = rightBottle;
  } else {
    scaleResult.value = { left: 'equal', right: 'equal' };
    // Si son iguales, no hacemos auto-retorno
    showSuccess('⚖️ Ambas botellas tienen el mismo peso');
    return;
  }

  // Auto-retornar el elemento más pesado y guardar el más ligero como mínimo candidato
  setTimeout(() => {
    // Retornar el más pesado a la primera posición vacía en la mesa de trabajo
    if (heavierBottle === leftBottle) {
      leftPanBottle.value = [];
    } else {
      rightPanBottle.value = [];
    }
    heavierBottle.state = 'normal';

    // Buscar primera posición vacía para retornar el elemento
    const emptyIndex = workbenchBottles.value.findIndex(b => b === null);
    if (emptyIndex !== -1) {
      workbenchBottles.value[emptyIndex] = heavierBottle;
    }

    // Actualizar el mínimo encontrado
    if (!currentMinBottle.value || lighterBottle.weight < currentMinBottle.value.weight) {
      // Si hay un mínimo previo en temp var, devolverlo a la mesa
      if (currentMinBottle.value && tempVariableArray.value.length > 0) {
        const oldMin = tempVariableArray.value[0];
        if (oldMin) {
          oldMin.state = 'normal';
          tempVariableArray.value = [];
          const emptyIdx = workbenchBottles.value.findIndex(b => b === null);
          if (emptyIdx !== -1) {
            workbenchBottles.value[emptyIdx] = oldMin;
          }
        }
      }

      // Mover el nuevo mínimo a la variable temporal
      if (lighterBottle === leftBottle) {
        leftPanBottle.value = [];
      } else {
        rightPanBottle.value = [];
      }
      lighterBottle.state = 'temp-variable';
      tempVariableArray.value = [lighterBottle];
      currentMinBottle.value = lighterBottle;
      showSuccess(`✓ Nuevo mínimo encontrado (peso: ${lighterBottle.weight}) → Guardado en min_actual`);
    } else {
      // El mínimo actual sigue siendo menor, retornar este también
      if (lighterBottle === leftBottle) {
        leftPanBottle.value = [];
      } else {
        rightPanBottle.value = [];
      }
      lighterBottle.state = 'normal';
      const emptyIdx = workbenchBottles.value.findIndex(b => b === null);
      if (emptyIdx !== -1) {
        workbenchBottles.value[emptyIdx] = lighterBottle;
      }
      showSuccess(`ℹ️ El mínimo actual (peso: ${currentMinBottle.value.weight}) sigue siendo menor`);
    }

    scaleWeighed.value = false;
    scaleResult.value = { left: null, right: null };

    // Verificar si terminamos las comparaciones de esta iteración
    const expectedComparisons = expectedComparisonsForIteration(currentIteration.value + 1);

    if (comparisonsInCurrentIteration.value >= expectedComparisons && tempVariableArray.value.length > 0) {
      // Trasladar automáticamente el mínimo a ORDENADOS[]
      setTimeout(() => {
        const minBottle = tempVariableArray.value[0];
        if (minBottle) {
          minBottle.state = 'consolidated';
          tempVariableArray.value = [];

          // Encontrar la primera posición vacía en el array ordenado
          const firstEmptyIndex = sortedShelfBottles.value.findIndex(b => b === null);
          if (firstEmptyIndex !== -1) {
            sortedShelfBottles.value[firstEmptyIndex] = minBottle;
          }

          currentMinBottle.value = null;

          // Registrar la iteración
          currentIteration.value++;
          iterationHistory.value.push({
            number: currentIteration.value,
            comparisons: comparisonsInCurrentIteration.value,
            description: `Iteración ${currentIteration.value}`,
          });
          comparisonsInCurrentIteration.value = 0;

          // Verificar si ya completamos todas las iteraciones
          if (currentIteration.value >= totalIterations.value) {
            // Mover el último elemento restante a ordenados automáticamente
            const remaining = workbenchBottles.value.filter(b => b !== null);
            if (remaining.length === 1) {
              const lastBottle = remaining[0];
              if (lastBottle) {
                lastBottle.state = 'consolidated';
                const lastIndex = workbenchBottles.value.findIndex(b => b?.id === lastBottle.id);
                if (lastIndex !== -1) {
                  workbenchBottles.value[lastIndex] = null;
                }

                const emptyIndex = sortedShelfBottles.value.findIndex(b => b === null);
                if (emptyIndex !== -1) {
                  sortedShelfBottles.value[emptyIndex] = lastBottle;
                }

                showSuccess(`🎉 ¡Ordenamiento completado! Todos los elementos están en ORDENADOS[] de menor a mayor`);
              }
            }
          } else {
            const remaining = workbenchBottles.value.filter(b => b !== null);
            showSuccess(`✅ Mínimo (peso: ${minBottle.weight}) → ORDENADOS[${firstEmptyIndex}]. Inicia Iteración ${currentIteration.value + 1} con ${remaining.length} elementos`);
          }
        }
      }, 500);
    }
  }, 1500); // Delay para que el usuario vea la comparación visual
};

// Function to reset the scale
const resetScale = () => {
  const leftBottle = leftPanBottle.value[0];
  if (leftBottle) {
    leftBottle.state = 'normal';
    const emptyIndex = workbenchBottles.value.findIndex(b => b === null);
    if (emptyIndex !== -1) {
      workbenchBottles.value[emptyIndex] = leftBottle;
    }
  }
  const rightBottle = rightPanBottle.value[0];
  if (rightBottle) {
    rightBottle.state = 'normal';
    const emptyIndex = workbenchBottles.value.findIndex(b => b === null);
    if (emptyIndex !== -1) {
      workbenchBottles.value[emptyIndex] = rightBottle;
    }
  }

  leftPanBottle.value = [];
  rightPanBottle.value = [];
  scaleWeighed.value = false;
  scaleResult.value = { left: null, right: null };
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
      const emptyIndex = workbenchBottles.value.findIndex(b => b === null);
      if (emptyIndex !== -1) {
        workbenchBottles.value[emptyIndex] = bottle;
      }
      stats.movimientos++;
    }
    return;
  }

  const rightIndex = rightPanBottle.value.findIndex((b) => b.id === bottleId);
  if (rightIndex !== -1) {
    const bottle = rightPanBottle.value.splice(rightIndex, 1)[0];
    if (bottle) {
      const emptyIndex = workbenchBottles.value.findIndex(b => b === null);
      if (emptyIndex !== -1) {
        workbenchBottles.value[emptyIndex] = bottle;
      }
      stats.movimientos++;
    }
  }
};

// Function to reset the entire algorithm and start fresh
const resetAlgorithm = () => {
  // Generate new random bottles
  workbenchBottles.value = [...generateRandomBottles(5)];

  // Clear sorted array
  sortedShelfBottles.value = [null, null, null, null, null];

  // Clear temp variable
  tempVariableArray.value = [];
  currentMinBottle.value = null;

  // Clear scale pans
  leftPanBottle.value = [];
  rightPanBottle.value = [];
  scaleWeighed.value = false;
  scaleResult.value = { left: null, right: null };

  // Reset iteration tracking
  currentIteration.value = 0;
  comparisonsInCurrentIteration.value = 0;
  iterationHistory.value = [];

  // Reset stats
  stats.pesajes = 0;
  stats.movimientos = 0;
  stats.comparaciones = 0;

  // Clear messages
  errorMessage.value = '';
  successMessage.value = '';

  showSuccess('🔄 Algoritmo reiniciado. ¡Comienza una nueva sesión de ordenamiento!');
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

/* Array slot styling */
.array-slot {
  display: flex;
  flex-direction: column;
  align-items: center;
  border-right: 2px solid #cbd5e1;
  padding: 0 8px;
  min-width: 70px;
}

.array-slot:last-child {
  border-right: none;
}

.index-box {
  margin-top: 8px;
  padding: 4px 12px;
  background: linear-gradient(to bottom, #3b82f6, #2563eb);
  color: white;
  font-weight: bold;
  font-size: 14px;
  border-radius: 6px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  font-family: 'Courier New', monospace;
}

.index-box-sorted {
  background: linear-gradient(to bottom, #22c55e, #16a34a);
}
</style>
