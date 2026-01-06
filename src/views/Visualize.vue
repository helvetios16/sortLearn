<template>
  <div class="min-h-screen bg-gray-50 text-gray-800">
    <div class="container mx-auto p-4 md:p-8">
      <h1
        class="text-3xl md:text-4xl font-extrabold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-teal-500"
      >
        Laboratorio de Ordenamiento
      </h1>

      <div class="flex flex-col gap-6">
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
                      :id="bottle.id"
                      :weight="bottle.weight"
                      :color="bottle.color"
                      :state="bottle.state"
                      :message="bottle.message"
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
                      :message="bottle.message"
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
                class="absolute bottom-28 w-64 h-2 bg-gradient-to-r from-gray-500 via-gray-400 to-gray-500 rounded-full shadow-lg transition-transform duration-700 origin-center ease-in-out"
                :style="{
                  transform: scalePhysicalState.barRotation
                }"
              ></div>

              <!-- Platillos (sin cadenas visibles) -->
              <div class="absolute bottom-28 w-full flex justify-between px-4">
                <!-- Platillo izquierdo -->
                <div class="flex flex-col items-center transition-all duration-700 ease-in-out" :style="{
                  transform: scalePhysicalState.leftPanTransform
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
                        :comparison="scalePhysicalState.leftState"
                        :message="bottle.message"
                        @return-bottle="returnBottleFromPan"
                      />
                    </template>
                  </draggable>
                </div>

                <!-- Platillo derecho -->
                <div class="flex flex-col items-center transition-all duration-700 ease-in-out" :style="{
                  transform: scalePhysicalState.rightPanTransform
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
                        :comparison="scalePhysicalState.rightState"
                        :message="bottle.message"
                        @return-bottle="returnBottleFromPan"
                      />
                    </template>
                  </draggable>
                </div>
              </div>
            </div>
            <!-- Removed manual PESAR button - weighing now automatic when both pans have bottles -->
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
                  @update:model-value="(bottles) => updateSortedBottleAtPosition(index - 1, bottles)"
                  :group="sortedGroup"
                  item-key="id"
                  class="flex items-end justify-center min-h-[80px]"
                >
                  <template #item="{ element: bottle }">
                    <Bottle
                      :id="bottle.id"
                      :weight="bottle.weight"
                      :color="bottle.color"
                      state="consolidated"
                      :message="bottle.message"
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

        <!-- Error/Success Messages (debajo de ORDENADOS[]) -->
        <div v-if="errorMessage" class="bg-red-100 border-2 border-red-400 text-red-800 px-4 py-3 rounded-lg text-center font-semibold animate-shake">
          {{ errorMessage }}
        </div>
        <div v-if="successMessage" class="bg-green-100 border-2 border-green-400 text-green-800 px-4 py-3 rounded-lg text-center font-semibold">
          {{ successMessage }}
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
  message?: string; // Mensaje de burbuja para mostrar sobre el frasco
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
    const bottle = bottles[0];
    if (bottle) {
      // Limpiar mensaje del frasco al devolverlo a DESORDENADOS[]
      bottle.message = undefined;
      bottle.state = 'normal';
    }
    workbenchBottles.value[index] = bottle ?? null;
    stats.movimientos++;
  } else {
    // Se quitó una botella de esta posición
    workbenchBottles.value[index] = null;
  }
};

// Helper function to update bottle at specific position in sorted shelf
const updateSortedBottleAtPosition = (index: number, bottles: Bottle[]) => {
  if (bottles.length > 0) {
    // Se agregó una botella a esta posición
    const addedBottle = bottles[0];

    // Limpiar mensaje del frasco inmediatamente al moverlo
    addedBottle.message = undefined;

    // Verificar si es el último frasco (ya no quedan más en DESORDENADOS[])
    const remainingBottles = workbenchBottles.value.filter(b => b !== null && b !== addedBottle);
    const isLastBottle = remainingBottles.length === 0;

    // Si es el último frasco, permitir moverlo directamente sin validaciones
    if (isLastBottle) {
      sortedShelfBottles.value[index] = addedBottle;
      addedBottle.state = 'consolidated';
      currentMinBottle.value = null;
      stats.movimientos++;

      // Completar la última iteración
      currentIteration.value++;
      iterationHistory.value.push({
        number: currentIteration.value,
        comparisons: comparisonsInCurrentIteration.value,
        description: `Iteración ${currentIteration.value}`,
      });
      comparisonsInCurrentIteration.value = 0;
      visitedBottlesInIteration.value.clear();

      showSuccess('🎉 ¡Ordenamiento completado! Todos los elementos están ordenados de menor a mayor.');
      return;
    }

    // Verificar que se cumplieron las comparaciones esperadas
    const expectedComparisons = expectedComparisonsForIteration(currentIteration.value + 1);
    if (comparisonsInCurrentIteration.value < expectedComparisons) {
      setTimeout(() => {
        // Devolver al platillo izquierdo si viene de ahí, sino a workbench
        if (leftPanBottle.value.length === 0) {
          leftPanBottle.value = [addedBottle];
        } else {
          const emptyIndex = workbenchBottles.value.findIndex(b => b === null);
          if (emptyIndex !== -1) {
            workbenchBottles.value[emptyIndex] = addedBottle;
          }
        }
        addedBottle.state = 'normal';
        showError(`⚠️ Aún faltan ${expectedComparisons - comparisonsInCurrentIteration.value} comparaciones. Sigue comparando.`);
      }, 100);
      return;
    }

    // Verificar que el frasco sea el mínimo (viene de Variable Temporal O del platillo izquierdo después de la última comparación)
    const isFromTempVariable = addedBottle === currentMinBottle.value;
    const isFromLeftPan = leftPanBottle.value.length > 0 && leftPanBottle.value[0] === addedBottle;

    if (!isFromTempVariable && !isFromLeftPan) {
      setTimeout(() => {
        const emptyIndex = workbenchBottles.value.findIndex(b => b === null);
        if (emptyIndex !== -1) {
          workbenchBottles.value[emptyIndex] = addedBottle;
        }
        addedBottle.state = 'normal';
        showError('⚠️ Solo puedes mover el mínimo encontrado (Variable Temporal o platillo izquierdo) a ORDENADOS[].');
      }, 100);
      return;
    }

    // Limpiar platillo izquierdo si el frasco viene de ahí
    if (isFromLeftPan) {
      leftPanBottle.value = [];
    }

    // Todo correcto: agregar a la posición y completar la iteración
    sortedShelfBottles.value[index] = addedBottle;
    addedBottle.state = 'consolidated';
    currentMinBottle.value = null;
    stats.movimientos++;

    // Registrar la iteración y resetear visitados
    currentIteration.value++;
    iterationHistory.value.push({
      number: currentIteration.value,
      comparisons: comparisonsInCurrentIteration.value,
      description: `Iteración ${currentIteration.value}`,
    });
    comparisonsInCurrentIteration.value = 0;
    visitedBottlesInIteration.value.clear(); // Limpiar conjunto de visitados para la nueva iteración

    // Verificar si completamos todas las iteraciones
    if (currentIteration.value >= totalIterations.value) {
      showSuccess('🎉 ¡Ordenamiento completado! Todos los elementos están ordenados de menor a mayor.');
    } else {
      const remaining = workbenchBottles.value.filter(b => b !== null);
      showSuccess(`✅ ¡Iteración ${currentIteration.value} completa! Continúa con los ${remaining.length} elementos restantes.`);
    }
  } else {
    // Se quitó una botella de esta posición (no debería pasar porque pull: false)
    sortedShelfBottles.value[index] = null;
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
const visitedBottlesInIteration = ref<Set<number>>(new Set()); // Conjunto de IDs de frascos ya comparados en esta iteración

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

// Computed: Estado físico de la balanza basado en los frascos presentes
const scalePhysicalState = computed(() => {
  const hasLeft = leftPanBottle.value.length > 0;
  const hasRight = rightPanBottle.value.length > 0;

  // Caso 1: Balanza vacía - posición horizontal
  if (!hasLeft && !hasRight) {
    return {
      barRotation: 'rotate(0deg)',
      leftPanTransform: 'translateY(0px)',
      rightPanTransform: 'translateY(0px)',
      leftState: null,
      rightState: null
    };
  }

  // Caso 2: Solo frasco en platillo izquierdo - se inclina hacia la izquierda
  if (hasLeft && !hasRight) {
    return {
      barRotation: 'rotate(-8deg)',
      leftPanTransform: 'translateY(20px)',
      rightPanTransform: 'translateY(-20px)',
      leftState: 'heavier',
      rightState: null
    };
  }

  // Caso 3: Solo frasco en platillo derecho - se inclina hacia la derecha
  if (!hasLeft && hasRight) {
    return {
      barRotation: 'rotate(8deg)',
      leftPanTransform: 'translateY(-20px)',
      rightPanTransform: 'translateY(20px)',
      leftState: null,
      rightState: 'heavier'
    };
  }

  // Caso 4: Dos frascos - usar resultado de comparación
  if (hasLeft && hasRight) {
    // Si el frasco izquierdo es más pesado (heavier), baja
    if (scaleResult.value.left === 'heavier') {
      return {
        barRotation: 'rotate(-8deg)',
        leftPanTransform: 'translateY(20px)',   // El pesado BAJA
        rightPanTransform: 'translateY(-20px)', // El ligero SUBE
        leftState: scaleResult.value.left,
        rightState: scaleResult.value.right
      };
    }
    // Si el frasco izquierdo es más ligero (lighter), sube
    else if (scaleResult.value.left === 'lighter') {
      return {
        barRotation: 'rotate(8deg)',
        leftPanTransform: 'translateY(-20px)',  // El ligero SUBE
        rightPanTransform: 'translateY(20px)',  // El pesado BAJA
        leftState: scaleResult.value.left,
        rightState: scaleResult.value.right
      };
    }
    // Si el frasco derecho es más pesado (heavier), baja
    else if (scaleResult.value.right === 'heavier') {
      return {
        barRotation: 'rotate(8deg)',
        leftPanTransform: 'translateY(-20px)', // El ligero SUBE
        rightPanTransform: 'translateY(20px)', // El pesado BAJA
        leftState: scaleResult.value.left,
        rightState: scaleResult.value.right
      };
    }
    else {
      // Igual o sin pesar aún
      return {
        barRotation: 'rotate(0deg)',
        leftPanTransform: 'translateY(0px)',
        rightPanTransform: 'translateY(0px)',
        leftState: scaleResult.value.left,
        rightState: scaleResult.value.right
      };
    }
  }

  // Fallback
  return {
    barRotation: 'rotate(0deg)',
    leftPanTransform: 'translateY(0px)',
    rightPanTransform: 'translateY(0px)',
    leftState: null,
    rightState: null
  };
});

// Watch for changes in pans to auto-weigh and auto-reset
watch(
  [leftPanBottle, rightPanBottle],
  ([newLeft, newRight], [oldLeft, oldRight]) => {
    const hasLeft = newLeft.length > 0;
    const hasRight = newRight.length > 0;

    // Caso 1: Si se retira algún frasco, resetear la balanza y limpiar mensajes
    if (
      scaleWeighed.value &&
      (newLeft.length < oldLeft.length || newRight.length < oldRight.length)
    ) {
      scaleWeighed.value = false;
      scaleResult.value = { left: null, right: null };

      // Limpiar mensajes de los frascos
      if (newLeft.length > 0) {
        newLeft[0].message = undefined;
        newLeft[0].state = 'normal';
      }
      if (newRight.length > 0) {
        newRight[0].message = undefined;
        newRight[0].state = 'normal';
      }
      return;
    }

    // Caso 2: Si ahora hay dos frascos y no se ha pesado aún, activar pesaje automático
    if (hasLeft && hasRight && !scaleWeighed.value) {
      // Trigger automatic weighing
      weighBottlesAutomatic();
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

// Function to handle changes in temp variable zone
const handleTempVariableChange = (evt: { added?: { element: Bottle } }) => {
  if (evt.added) {
    const addedBottle = evt.added.element as Bottle;

    // Limpiar mensaje del frasco inmediatamente al moverlo
    addedBottle.message = undefined;

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
    showSuccess(`📝 Nuevo mínimo guardado en Variable Temporal.`);
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

// Function to weigh bottles automatically (triggered when both pans have bottles)
const weighBottlesAutomatic = () => {
  const leftBottle = leftPanBottle.value[0];
  const rightBottle = rightPanBottle.value[0];

  if (!leftBottle || !rightBottle) return;

  // VALIDACIÓN: Verificar que el frasco derecho no haya sido comparado ya
  if (visitedBottlesInIteration.value.has(rightBottle.id)) {
    rightBottle.message = '❌ Este frasco ya fue comparado. Elige otro.';
    showError('Este frasco ya fue comparado en esta iteración. Elige otro frasco.');
    setTimeout(() => {
      if (rightBottle.message) rightBottle.message = undefined;
    }, 3000);
    return;
  }

  // Agregar el frasco derecho al conjunto de visitados
  visitedBottlesInIteration.value.add(rightBottle.id);

  stats.pesajes++;
  stats.comparaciones++;
  comparisonsInCurrentIteration.value++;
  scaleWeighed.value = true; // Set scale to weighed state

  // Update bottle states to show they're being compared
  leftBottle.state = 'comparing';
  rightBottle.state = 'comparing';

  // PASO 1: Calcular resultado y actualizar scaleResult para activar animación física
  if (leftBottle.weight > rightBottle.weight) {
    scaleResult.value = { left: 'heavier', right: 'lighter' };
  } else if (rightBottle.weight > leftBottle.weight) {
    scaleResult.value = { left: 'lighter', right: 'heavier' };
  } else {
    scaleResult.value = { left: 'equal', right: 'equal' };
  }

  // PASO 2: Esperar a que la animación física termine (700ms) antes de mostrar mensajes
  setTimeout(() => {
    // Verificar si se completaron todas las comparaciones de esta iteración
    const expectedComparisons = expectedComparisonsForIteration(currentIteration.value + 1);
    const isLastComparison = comparisonsInCurrentIteration.value >= expectedComparisons;

    if (leftBottle.weight > rightBottle.weight) {
      // CASO A: El frasco derecho (nuevo) es MENOR - Nuevo mínimo
      if (isLastComparison) {
        // Última comparación: el frasco izquierdo es el mínimo final
        leftBottle.message = `✅ Mínimo encontrado en Iteración ${currentIteration.value + 1}. Llévame a ORDENADOS[]`;
        rightBottle.message = 'Soy más pesado. Devuélveme a mi lugar.';
      } else {
        rightBottle.message = '¡Soy más ligero! Arrástrame a la Zona Temporal.';
        leftBottle.message = 'Soy más pesado. Devuélveme a mi lugar.';
      }
    } else if (rightBottle.weight > leftBottle.weight) {
      // CASO B: El frasco derecho (nuevo) es MAYOR - Descartar
      if (isLastComparison) {
        // Última comparación: el frasco izquierdo es el mínimo final
        leftBottle.message = `✅ Mínimo encontrado en Iteración ${currentIteration.value + 1}. Llévame a ORDENADOS[]`;
        rightBottle.message = 'Soy más pesado. Devuélveme a mi lugar.';
      } else {
        rightBottle.message = 'Soy más pesado. Devuélveme a mi lugar.';
        leftBottle.message = 'Sigo siendo el más ligero.';
      }
    } else {
      // Empate
      rightBottle.message = '⚖️ ¡Empate! Elige cualquiera.';
      leftBottle.message = '⚖️ ¡Empate! Elige cualquiera.';
    }

    scaleWeighed.value = false;
  }, 700); // Esperar exactamente el tiempo de la animación física (700ms)
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
  visitedBottlesInIteration.value.clear(); // Limpiar conjunto de visitados

  // Reset stats
  stats.pesajes = 0;
  stats.movimientos = 0;
  stats.comparaciones = 0;

  // Clear messages
  errorMessage.value = '';
  successMessage.value = '';

  showSuccess('🔄 ¡Todo listo! Arrastra un frasco a cada platillo de la balanza y presiona PESAR.');
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
