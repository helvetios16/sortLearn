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

        <!-- Fila Superior: Zona de Botellas Desordenadas (Array Visual) -->
        <div class="bg-amber-100 border-2 border-amber-200 rounded-xl p-6 shadow-inner">
          <h2 class="text-xl font-bold text-amber-800 mb-4">
            Mesa de Trabajo - <span class="font-mono text-blue-700">DESORDENADOS[]</span>
          </h2>
          <div class="min-h-48 flex justify-center items-center">
            <div v-if="workbenchBottles.length > 0" class="inline-flex border-4 border-blue-400 rounded-lg bg-white/50 p-2">
              <draggable
                v-model="workbenchBottles"
                :group="mainGroup"
                item-key="id"
                class="flex gap-1 items-end"
                @change="logMovement"
              >
                <template #item="{ element: bottle, index }">
                  <div class="array-slot">
                    <Bottle
                      :id="bottle.id"
                      :weight="bottle.weight"
                      :color="bottle.color"
                      :state="bottle.state"
                    />
                    <div class="index-box">
                      {{ index }}
                    </div>
                  </div>
                </template>
              </draggable>
            </div>
            <p
              v-else
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

          <!-- Panel de Progreso del Algoritmo Selection Sort -->
          <div class="bg-slate-50 border-2 border-slate-200 rounded-xl shadow-lg p-6">
            <h2 class="text-xl font-bold text-slate-800 mb-4">📊 Progreso del Algoritmo: Selection Sort</h2>

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
              <button
                @click="finishIteration"
                class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                :disabled="comparisonsInCurrentIteration === 0"
              >
                Terminar Iteración {{ currentIteration + 1 }}
              </button>
            </div>
          </div>
        </div>

        <!-- Fila Inferior: Estantería Ordenada (Array Visual) -->
        <div class="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-6 shadow-inner">
          <h2 class="text-xl font-bold text-emerald-800 mb-4">
            Estantería Ordenada - <span class="font-mono text-green-700">ORDENADOS[]</span> ✓
          </h2>
          <div class="min-h-32 flex justify-center items-center">
            <div v-if="sortedShelfBottles.length > 0" class="inline-flex border-4 border-green-500 rounded-lg bg-white/50 p-2">
              <draggable
                v-model="sortedShelfBottles"
                :group="sortedGroup"
                item-key="id"
                class="flex gap-1 items-end"
                @change="handleSortedShelfChange"
              >
                <template #item="{ element: bottle, index }">
                  <div class="array-slot">
                    <Bottle
                      :id="bottle.id"
                      :weight="bottle.weight"
                      :color="bottle.color"
                      state="consolidated"
                    />
                    <div class="index-box index-box-sorted">
                      {{ index }}
                    </div>
                  </div>
                </template>
              </draggable>
            </div>
            <p
              v-else
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
const workbenchBottles = ref<Bottle[]>(generateRandomBottles(5));
const leftPanBottle = ref<Bottle[]>([]);
const rightPanBottle = ref<Bottle[]>([]);
const sortedShelfBottles = ref<Bottle[]>([]);
const tempVariableArray = ref<Bottle[]>([]); // Variable temporal (min_actual) as array for draggable
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

// Function to handle the @change event from draggable
const logMovement = (evt: any) => {
  if (evt.added) {
    stats.movimientos++;
  }
};

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
      workbenchBottles.value.push(bottle);
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
      workbenchBottles.value.push(addedBottle);
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
    // Retornar el más pesado a la mesa de trabajo
    if (heavierBottle === leftBottle) {
      leftPanBottle.value = [];
    } else {
      rightPanBottle.value = [];
    }
    heavierBottle.state = 'normal';
    workbenchBottles.value.push(heavierBottle);

    // Actualizar el mínimo encontrado
    if (!currentMinBottle.value || lighterBottle.weight < currentMinBottle.value.weight) {
      // Si hay un mínimo previo en temp var, devolverlo a la mesa
      if (currentMinBottle.value && tempVariableArray.value.length > 0) {
        const oldMin = tempVariableArray.value[0];
        if (oldMin) {
          oldMin.state = 'normal';
          tempVariableArray.value = [];
          workbenchBottles.value.push(oldMin);
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
      workbenchBottles.value.push(lighterBottle);
      showSuccess(`ℹ️ El mínimo actual (peso: ${currentMinBottle.value.weight}) sigue siendo menor`);
    }

    scaleWeighed.value = false;
    scaleResult.value = { left: null, right: null };
  }, 1500); // Delay para que el usuario vea la comparación visual
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
    // Verificar que hay un mínimo en la variable temporal
    if (tempVariableArray.value.length === 0) {
      showError('⚠️ Debes tener un elemento en min_actual antes de terminar la iteración');
      return;
    }

    // Trasladar automáticamente el mínimo a la zona de ordenados
    const minBottle = tempVariableArray.value[0];
    if (minBottle) {
      minBottle.state = 'consolidated';
      tempVariableArray.value = [];
      sortedShelfBottles.value.push(minBottle);
      currentMinBottle.value = null;

      showSuccess(`✅ Iteración ${currentIteration.value + 1} completada. Mínimo (peso: ${minBottle.weight}) movido a ORDENADOS[]`);
    }

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
      if (workbenchBottles.value.length === 1) {
        const lastBottle = workbenchBottles.value[0];
        if (lastBottle) {
          lastBottle.state = 'consolidated';
          workbenchBottles.value = [];
          sortedShelfBottles.value.push(lastBottle);
          showSuccess(`🎉 ¡Ordenamiento completado! Todos los elementos están en ORDENADOS[] de menor a mayor`);
        }
      }
    } else {
      showSuccess(`🔄 Inicia la Iteración ${currentIteration.value + 1}. Compara los ${workbenchBottles.value.length} elementos restantes`);
    }
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
