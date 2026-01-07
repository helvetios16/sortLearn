<template>
  <div class="min-h-screen bg-gray-50 text-gray-800">
    <div class="container mx-auto p-4 md:p-8">
      <h1
        class="text-3xl md:text-4xl font-extrabold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-teal-500"
      >
        Laboratorio de Ordenamiento
      </h1>

      <!-- Panel de Instrucciones Guiadas -->
      <div
        class="border-2 rounded-xl shadow-lg p-4 mb-6 transition-all duration-300"
        :class="{
          'bg-blue-50 border-blue-400': guidedMessage.type === 'info',
          'bg-green-50 border-green-400': guidedMessage.type === 'success',
        }"
      >
        <div class="flex items-start gap-3">
          <!-- Icono -->
          <div
            class="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
            :class="{
              'bg-blue-200 text-blue-700': guidedMessage.type === 'info',
              'bg-green-200 text-green-700': guidedMessage.type === 'success',
            }"
          >
            <svg
              v-if="guidedMessage.type === 'info'"
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <svg
              v-else
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          <!-- Contenido del mensaje -->
          <div class="flex-1">
            <h3
              class="font-bold text-lg mb-1"
              :class="{
                'text-blue-900': guidedMessage.type === 'info',
                'text-green-900': guidedMessage.type === 'success',
              }"
            >
              {{ guidedMessage.title }}
            </h3>
            <p
              class="text-sm"
              :class="{
                'text-blue-800': guidedMessage.type === 'info',
                'text-green-800': guidedMessage.type === 'success',
              }"
            >
              {{ guidedMessage.text }}
            </p>
          </div>
        </div>
      </div>

      <div class="flex flex-col gap-6">
        <!-- Fila Superior: Zona de Botellas Desordenadas (Array Visual) -->
        <div class="bg-amber-100 border-2 border-amber-200 rounded-xl p-3 shadow-inner">
          <div class="flex flex-col gap-2">
            <!-- Título y estado del bucle FOR -->
            <div class="flex items-center justify-center gap-3">
              <h2 class="text-xl font-bold text-blue-600 whitespace-nowrap">
                ARRAY (ordenamiento in-place)
              </h2>
              <!-- Indicador del bucle FOR -->
              <div
                v-if="currentIteration < totalIterations"
                class="bg-gradient-to-r from-purple-100 to-blue-100 border-2 border-purple-400 rounded-lg px-4 py-2"
              >
                <div class="text-xs font-mono text-purple-900 font-bold flex items-center gap-2">
                  <span class="bg-purple-200 px-2 py-0.5 rounded">i = {{ currentIteration }}</span>
                  <span>→</span>
                  <span class="text-gray-600"
                    >Iteración {{ currentIteration + 1 }} de {{ totalIterations }}</span
                  >
                </div>
                <div
                  class="text-xs text-blue-700 mt-1 font-mono"
                  v-if="comparisonsInCurrentIteration > 0"
                >
                  <span class="bg-blue-200 px-2 py-0.5 rounded">j recorriendo</span> ({{
                    comparisonsInCurrentIteration
                  }}/{{ expectedComparisonsForIteration(currentIteration + 1) }} comparaciones)
                </div>
              </div>
              <div
                v-else
                class="bg-green-100 border-2 border-green-400 rounded-lg px-4 py-2"
              >
                <div class="text-xs font-mono text-green-900 font-bold">Proceso completado</div>
              </div>
            </div>

            <!-- Array estático con 5 posiciones siempre visibles -->
            <div class="flex flex-col items-center justify-center gap-2">
              <!-- Etiquetas de zona -->
              <div class="flex w-full justify-center">
                <div class="inline-flex w-full max-w-[390px]">
                  <!-- Zona Ordenada -->
                  <div
                    v-if="currentIteration > 0"
                    class="flex-1 text-center"
                  >
                    <span
                      class="text-xs font-bold text-green-700 bg-green-100 px-3 py-1 rounded-lg border border-green-300"
                    >
                      ZONA ORDENADA ({{ currentIteration }} elementos)
                    </span>
                  </div>
                  <!-- Zona No Ordenada -->
                  <div
                    v-if="currentIteration < 5"
                    class="flex-1 text-center"
                  >
                    <span
                      class="text-xs font-bold text-amber-700 bg-amber-100 px-3 py-1 rounded-lg border border-amber-300"
                    >
                      ZONA DE BÚSQUEDA ({{ 5 - currentIteration }} elementos)
                    </span>
                  </div>
                </div>
              </div>
              <div class="inline-flex border-4 border-blue-400 rounded-lg bg-white/50 p-1.5">
                <div
                  v-for="index in 5"
                  :key="index"
                  class="array-slot"
                  :class="{
                    'array-slot-completed': index - 1 < currentIteration,
                    'array-slot-current':
                      index - 1 >= currentIteration && workbenchBottles[index - 1] !== null,
                    'array-slot-searching': index - 1 === currentIteration,
                    'array-slot-border-zone': index - 1 === currentIteration,
                  }"
                >
                  <!-- Cada slot tiene su propio draggable -->
                  <draggable
                    :model-value="
                      getBottleAtPosition(index - 1) ? [getBottleAtPosition(index - 1)] : []
                    "
                    @update:model-value="(bottles) => updateBottleAtPosition(index - 1, bottles)"
                    :group="getGroupForPosition(index - 1)"
                    item-key="id"
                    class="flex items-end justify-center min-h-[80px]"
                  >
                    <template #item="{ element: bottle }">
                      <Bottle
                        :id="bottle.id"
                        :weight="bottle.weight"
                        :color="bottle.color"
                        :state="index - 1 < currentIteration ? 'consolidated' : bottle.state"
                        :message="bottle.message"
                      />
                    </template>
                    <template #header>
                      <div
                        v-if="!getBottleAtPosition(index - 1)"
                        class="empty-slot"
                      >
                        <div
                          class="w-12 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50/50"
                        >
                          <span class="text-gray-400 text-xs">vacío</span>
                        </div>
                      </div>
                    </template>
                  </draggable>
                  <!-- Índice con indicador de estado -->
                  <div
                    class="index-box"
                    :class="{
                      'index-box-completed': index - 1 < currentIteration,
                      'index-box-searching': index - 1 === currentIteration,
                      'index-box-inner-loop': index - 1 > currentIteration && index - 1 < 5,
                    }"
                  >
                    <div class="flex flex-col items-center">
                      <span>{{ index - 1 }}</span>
                      <!-- Índice i (bucle externo) -->
                      <div
                        v-if="index - 1 === currentIteration"
                        class="text-xs mt-1 font-bold animate-bounce"
                      >
                        ↑ i
                      </div>
                      <!-- Zona completada -->
                      <div
                        v-if="index - 1 < currentIteration"
                        class="text-xs mt-1"
                      >
                        ✓
                      </div>
                      <!-- Zona de recorrido j (bucle interno) -->
                      <div
                        v-if="index - 1 > currentIteration && currentIteration < totalIterations"
                        class="text-xs mt-1 font-bold text-blue-600"
                      >
                        j
                      </div>
                    </div>
                  </div>
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
                :group="tempVariableGroup"
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
                        min_actual (bucle interno j)
                      </p>
                      <p class="text-xs text-center text-yellow-700 mt-1">
                        Iteración i={{ currentIteration }}
                      </p>
                      <p class="text-xs text-center text-yellow-600 mt-1 font-mono">
                        Peso: {{ bottle.weight }}
                      </p>
                    </div>
                  </div>
                </template>
                <template
                  #header
                  v-if="tempVariableArray.length === 0"
                >
                  <div class="text-center text-yellow-600/60">
                    <!-- Mostrar valor guardado en currentMinBottle -->
                    <div
                      v-if="currentMinBottle"
                      class="p-3 bg-yellow-100 border-2 border-yellow-400 rounded-lg"
                    >
                      <p class="text-sm font-mono text-yellow-900 font-bold">
                        min_actual = Frasco #{{ currentMinBottle.id }}
                      </p>
                      <p class="text-xs text-yellow-700 mt-1">
                        Peso: {{ currentMinBottle.weight }}
                      </p>
                      <p class="text-xs text-yellow-600 mt-2 italic">
                        Coloca en posición {{ currentIteration }}
                      </p>
                    </div>
                    <!-- Si no hay valor guardado -->
                    <div v-else>
                      <div
                        class="w-16 h-24 border-2 border-dashed border-yellow-300 rounded-lg flex items-center justify-center mb-2 mx-auto"
                      >
                        <span class="text-2xl">?</span>
                      </div>
                      <p class="text-sm font-mono">min_actual = ?</p>
                      <p class="text-xs mt-1 italic">El bucle j encontrará el mínimo</p>
                    </div>
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
              <div
                class="absolute bottom-0 w-32 h-3 bg-gradient-to-b from-gray-400 to-gray-500 rounded-sm shadow-md"
              ></div>

              <!-- Soporte vertical central (sin la línea) -->
              <div
                class="absolute bottom-3 w-3 h-28 bg-gradient-to-r from-gray-500 via-gray-400 to-gray-500 shadow-lg rounded-t-sm"
              ></div>

              <!-- Punto de apoyo (fulcro) -->
              <div
                class="absolute bottom-28 w-6 h-6 bg-gray-600 rounded-full border-2 border-gray-700 shadow-lg z-20"
              ></div>

              <!-- Barra horizontal (se inclina según el peso) -->
              <div
                class="absolute bottom-28 w-64 h-2 bg-gradient-to-r from-gray-500 via-gray-400 to-gray-500 rounded-full shadow-lg transition-transform duration-700 origin-center ease-in-out"
                :style="{
                  transform: scalePhysicalState.barRotation,
                }"
              ></div>

              <!-- Platillos (sin cadenas visibles) -->
              <div class="absolute bottom-28 w-full flex justify-between px-4">
                <!-- Platillo izquierdo -->
                <div
                  class="flex flex-col items-center transition-all duration-700 ease-in-out"
                  :style="{
                    transform: scalePhysicalState.leftPanTransform,
                  }"
                >
                  <!-- Plato visual (ovalado/triangular) -->
                  <div
                    class="w-20 h-5 rounded-full bg-gradient-to-b from-gray-200 via-gray-300 to-gray-400 border-2 border-black shadow-xl"
                    style="border-radius: 50%; transform: perspective(100px) rotateX(60deg)"
                  ></div>

                  <!-- Área draggable encima del plato -->
                  <draggable
                    v-model="leftPanBottle"
                    :group="panGroup"
                    item-key="id"
                    class="absolute -top-14 flex items-center justify-center min-h-[60px] min-w-[80px]"
                    data-pan="left"
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
                <div
                  class="flex flex-col items-center transition-all duration-700 ease-in-out"
                  :style="{
                    transform: scalePhysicalState.rightPanTransform,
                  }"
                >
                  <!-- Plato visual (ovalado/triangular) -->
                  <div
                    class="w-20 h-5 rounded-full bg-gradient-to-b from-gray-200 via-gray-300 to-gray-400 border-2 border-black shadow-xl"
                    style="border-radius: 50%; transform: perspective(100px) rotateX(60deg)"
                  ></div>

                  <!-- Área draggable encima del plato -->
                  <draggable
                    v-model="rightPanBottle"
                    :group="panGroup"
                    item-key="id"
                    class="absolute -top-14 flex items-center justify-center min-h-[60px] min-w-[80px]"
                    data-pan="right"
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
              <div
                v-for="iterNum in totalIterations"
                :key="iterNum"
                class="flex items-center gap-2 text-xs font-mono"
              >
                <span
                  class="font-bold min-w-[85px]"
                  :class="{
                    'text-slate-700': iterNum <= currentIteration,
                    'text-yellow-700':
                      iterNum === currentIteration + 1 && comparisonsInCurrentIteration > 0,
                    'text-slate-400':
                      iterNum > currentIteration + 1 ||
                      (iterNum === currentIteration + 1 && comparisonsInCurrentIteration === 0),
                  }"
                >
                  ITERACION {{ iterNum }}:
                </span>
                <div class="flex gap-0">
                  <!-- Iteración completada -->
                  <template v-if="iterNum <= currentIteration">
                    <span
                      v-for="i in getIterationComparisons(iterNum)"
                      :key="i"
                      class="text-slate-600"
                      >█</span
                    >
                  </template>
                  <!-- Iteración actual en progreso -->
                  <template v-else-if="iterNum === currentIteration + 1">
                    <span
                      v-for="i in comparisonsInCurrentIteration"
                      :key="i"
                      class="text-yellow-600"
                      >█</span
                    >
                    <span
                      v-for="i in expectedComparisonsForIteration(iterNum) -
                      comparisonsInCurrentIteration"
                      :key="'empty-' + i"
                      class="text-slate-300"
                      >█</span
                    >
                  </template>
                  <!-- Iteraciones pendientes -->
                  <template v-else>
                    <span
                      v-for="i in expectedComparisonsForIteration(iterNum)"
                      :key="i"
                      class="text-slate-300"
                      >█</span
                    >
                  </template>
                </div>
                <span
                  class="ml-1 text-xs"
                  :class="{
                    'text-slate-500': iterNum <= currentIteration,
                    'text-yellow-600':
                      iterNum === currentIteration + 1 && comparisonsInCurrentIteration > 0,
                    'text-slate-400':
                      iterNum > currentIteration + 1 ||
                      (iterNum === currentIteration + 1 && comparisonsInCurrentIteration === 0),
                  }"
                >
                  {{
                    iterNum <= currentIteration
                      ? `(${getIterationComparisons(iterNum)} comparaciones) ✓`
                      : iterNum === currentIteration + 1 && comparisonsInCurrentIteration > 0
                        ? `(${comparisonsInCurrentIteration}/${expectedComparisonsForIteration(iterNum)})`
                        : `(${expectedComparisonsForIteration(iterNum)} comparaciones)`
                  }}
                </span>
              </div>
            </div>

            <div class="pt-3 border-t border-slate-300">
              <div class="text-center mb-3">
                <span class="text-sm font-semibold text-slate-700">Comparaciones totales: </span>
                <span class="text-2xl font-extrabold text-blue-600">{{ stats.comparaciones }}</span>
              </div>

              <!-- Mensaje de estado y botón de reinicio -->
              <div
                v-if="currentIteration >= totalIterations"
                class="space-y-2"
              >
                <div class="text-center text-sm text-green-600 font-semibold py-2">
                  Proceso completado.
                </div>
                <button
                  @click="resetAlgorithm"
                  class="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <span>TERMINAR PROCESO</span>
                </button>
              </div>
              <div
                v-else
                class="space-y-2"
              >
                <div class="text-center text-sm text-slate-500 italic py-2">
                  Continúa comparando elementos en la balanza...
                </div>
                <button
                  @click="resetAlgorithm"
                  class="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <span>REINICIAR PROCESO</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Error/Success Messages -->
        <div
          v-if="errorMessage"
          class="bg-red-100 border-2 border-red-400 text-red-800 px-4 py-3 rounded-lg text-center font-semibold animate-shake"
        >
          {{ errorMessage }}
        </div>
        <div
          v-if="successMessage"
          class="bg-green-100 border-2 border-green-400 text-green-800 px-4 py-3 rounded-lg text-center font-semibold"
        >
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
      state: 'normal', // Estado inicial normal
      message: undefined, // Sin mensaje inicial
    });
  }
  return bottles;
};

// Reactive state - Array estático de 5 posiciones (puede tener nulls)
const workbenchBottles = ref<(Bottle | null)[]>([...generateRandomBottles(5)]);
const leftPanBottle = ref<Bottle[]>([]);
const rightPanBottle = ref<Bottle[]>([]);
const tempVariableArray = ref<Bottle[]>([]); // Variable temporal (min_actual) as array for draggable

// Sistema de mensajes guiados
const userHasInteracted = ref(false); // Detectar si el usuario ha movido algo

// Helper function to get bottle at specific position in workbench
const getBottleAtPosition = (index: number): Bottle | null => {
  return workbenchBottles.value[index] || null;
};

// Helper function to update bottle at specific position in workbench
const updateBottleAtPosition = (index: number, bottles: Bottle[]) => {
  // RESTRICCIÓN 1: Solo permitir UN frasco por posición
  if (bottles.length > 1) {
    // Si se intenta agregar más de un frasco, devolver el extra
    const extraBottle = bottles.pop();
    if (extraBottle) {
      const emptyIndex = workbenchBottles.value.findIndex((b) => b === null);
      if (emptyIndex !== -1) {
        workbenchBottles.value[emptyIndex] = extraBottle;
      }
    }
    showError('Solo un frasco por posición.');
    return;
  }

  // RESTRICCIÓN 2: No permitir agregar a una posición que ya tiene un frasco
  if (bottles.length > 0 && workbenchBottles.value[index] !== null) {
    const bottle = bottles[0];
    setTimeout(() => {
      // Devolver el frasco a una posición vacía
      const emptyIndex = workbenchBottles.value.findIndex((b) => b === null);
      if (emptyIndex !== -1) {
        workbenchBottles.value[emptyIndex] = bottle;
      }
      showError('Posición ocupada. Usa una posición vacía.');
    }, 100);
    return;
  }

  // Verificar si es el último frasco y se está colocando en la zona ordenada
  const isLastBottle = workbenchBottles.value.filter((b) => b !== null).length === 1;

  if (bottles.length > 0) {
    // Se agregó una botella a esta posición
    const bottle = bottles[0];

    // RESTRICCIÓN ESPECIAL: Si el frasco viene de min_actual, solo puede ir a posición i
    const isFromMinActual = bottle === currentMinBottle.value;
    if (isFromMinActual && index !== currentIteration.value) {
      setTimeout(() => {
        // Devolver a la variable temporal
        tempVariableArray.value = [bottle];
        showError(
          `El mínimo de min_actual solo puede colocarse en la posición i=${currentIteration.value}`,
        );
      }, 100);
      return;
    }

    // Si el frasco viene de min_actual Y va a la posición correcta (i), verificar comparaciones completadas
    if (isFromMinActual && index === currentIteration.value) {
      const expectedComparisons = expectedComparisonsForIteration(currentIteration.value + 1);

      // Verificar que se completaron todas las comparaciones
      if (comparisonsInCurrentIteration.value < expectedComparisons) {
        setTimeout(() => {
          tempVariableArray.value = [bottle];
          showError(
            `Faltan ${expectedComparisons - comparisonsInCurrentIteration.value} comparaciones. Continúa comparando antes de colocar min_actual.`,
          );
        }, 100);
        return;
      }

      // Todas las comparaciones completadas, permitir colocar en posición i
      // Continuar con el flujo normal de consolidación
    }

    // Validar si se intenta mover a la zona ordenada (index < currentIteration)
    if (index < currentIteration.value && !isLastBottle) {
      setTimeout(() => {
        // Devolver la botella a su posición original
        const emptyIndex = workbenchBottles.value.findIndex(
          (b, i) => b === null && i >= currentIteration.value,
        );
        if (emptyIndex !== -1) {
          workbenchBottles.value[emptyIndex] = bottle;
        }
        showError(
          'Zona ordenada bloqueada. Coloca el mínimo en posición i=' + currentIteration.value,
        );
      }, 100);
      return;
    }

    // Validar si se intenta colocar en la posición i (currentIteration) - debe ser el mínimo
    if (index === currentIteration.value && !isLastBottle) {
      // Si estamos en la última iteración y solo queda 1 comparación, permitir colocar directamente
      const expectedComparisons = expectedComparisonsForIteration(currentIteration.value + 1);
      const isLastIteration = currentIteration.value === totalIterations.value - 1;

      // En la última iteración con 1 comparación esperada, permitir colocar el elemento sin más validaciones
      if (isLastIteration && expectedComparisons === 1) {
        // Permitir colocar directamente
      } else {
        // Verificar que se cumplieron las comparaciones esperadas
        if (comparisonsInCurrentIteration.value < expectedComparisons) {
          setTimeout(() => {
            // Devolver al platillo izquierdo si viene de ahí, sino a workbench
            if (leftPanBottle.value.length === 0) {
              leftPanBottle.value = [bottle];
            } else {
              const emptyIndex = workbenchBottles.value.findIndex(
                (b, i) => b === null && i > currentIteration.value,
              );
              if (emptyIndex !== -1) {
                workbenchBottles.value[emptyIndex] = bottle;
              }
            }
            showError(
              `Faltan ${expectedComparisons - comparisonsInCurrentIteration.value} comparaciones. Continúa comparando.`,
            );
          }, 100);
          return;
        }

        // Verificar que el frasco sea el mínimo (viene de Variable Temporal O del platillo izquierdo después de la última comparación)
        const isFromTempVariable = bottle === currentMinBottle.value;
        const isFromLeftPan = leftPanBottle.value.length > 0 && leftPanBottle.value[0] === bottle;

        if (!isFromTempVariable && !isFromLeftPan) {
          setTimeout(() => {
            const emptyIndex = workbenchBottles.value.findIndex(
              (b, i) => b === null && i > currentIteration.value,
            );
            if (emptyIndex !== -1) {
              workbenchBottles.value[emptyIndex] = bottle;
            }
            showError('Solo el mínimo puede ir a posición i=' + currentIteration.value);
          }, 100);
          return;
        }
      }

      // Limpiar platillo izquierdo si el frasco viene de ahí
      if (isFromLeftPan) {
        leftPanBottle.value = [];
      }

      // Todo correcto: colocar en posición i y marcar como consolidado
      bottle.message = undefined;
      bottle.state = 'consolidated';
      workbenchBottles.value[index] = bottle;
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
      visitedBottlesInIteration.value.clear();

      // Verificar si completamos todas las iteraciones
      if (currentIteration.value >= totalIterations.value) {
        showSuccess('Ordenamiento completado. Array ordenado correctamente.');
      } else {
        const remaining = workbenchBottles.value.filter(
          (b, i) => b !== null && i >= currentIteration.value,
        );
        showSuccess(
          `Iteración i=${currentIteration.value - 1} completa. Mínimo colocado. Quedan ${remaining.length} elementos.`,
        );
      }
      return;
    }

    // Para otras posiciones (zona de búsqueda), permitir movimiento normal
    if (bottle) {
      bottle.message = undefined;
      bottle.state = 'normal';
    }
    workbenchBottles.value[index] = bottle ?? null;
    stats.movimientos++;
  } else {
    // Se quitó una botella de esta posición
    // No permitir sacar de la zona ordenada
    if (index < currentIteration.value) {
      showError('No puedes mover elementos de la zona ordenada.');
      return;
    }
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

// Computed: Mensaje guiado contextual basado en el estado del algoritmo
const guidedMessage = computed(() => {
  // Proceso completado
  if (currentIteration.value >= totalIterations.value) {
    return {
      type: 'success',
      title: 'Ordenamiento completado',
      text: 'Has ordenado exitosamente todos los frascos usando Selection Sort.',
    };
  }

  // Primera iteración - inicio
  if (
    currentIteration.value === 0 &&
    comparisonsInCurrentIteration.value === 0 &&
    !userHasInteracted.value
  ) {
    return {
      type: 'info',
      title: '¡Comencemos!',
      text: 'Selection Sort busca el elemento más pequeño. Arrastra cualquier frasco a la balanza izquierda para iniciar la búsqueda.',
    };
  }

  // Primera iteración - primer frasco en balanza, esperando segundo
  if (
    currentIteration.value === 0 &&
    comparisonsInCurrentIteration.value === 0 &&
    leftPanBottle.value.length === 1 &&
    rightPanBottle.value.length === 0
  ) {
    return {
      type: 'info',
      title: 'Comparar dos frascos',
      text: 'Arrastra otro frasco a la balanza derecha. La balanza mostrará cuál pesa menos.',
    };
  }

  // Ambos frascos en balanza, esperando que se complete el pesaje
  if (
    currentIteration.value === 0 &&
    comparisonsInCurrentIteration.value === 0 &&
    leftPanBottle.value.length === 1 &&
    rightPanBottle.value.length === 1
  ) {
    return {
      type: 'info',
      title: 'Observa la balanza',
      text: 'La balanza se inclina hacia el frasco más ligero. Este será tu primer candidato a mínimo.',
    };
  }

  // Primera comparación completada - explicar min_actual
  if (
    currentIteration.value === 0 &&
    comparisonsInCurrentIteration.value === 1 &&
    tempVariableArray.value.length === 0
  ) {
    return {
      type: 'info',
      title: 'Crear variable min_actual',
      text: 'Arrastra el frasco más ligero (el que está más abajo en la balanza) al cuadro amarillo "min_actual". Esta variable guardará el mínimo mientras sigues comparando.',
    };
  }

  // Variable min_actual asignada, continuar comparaciones
  if (
    tempVariableArray.value.length === 1 &&
    comparisonsInCurrentIteration.value <
      expectedComparisonsForIteration(currentIteration.value + 1)
  ) {
    const remainingComparisons =
      expectedComparisonsForIteration(currentIteration.value + 1) -
      comparisonsInCurrentIteration.value;
    const isFirstIteration = currentIteration.value === 0;
    return {
      type: 'info',
      title: isFirstIteration ? 'Buscar si hay un frasco más ligero' : 'Continuar búsqueda',
      text: isFirstIteration
        ? `Compara min_actual con los frascos restantes. Si encuentras uno más ligero, actualiza min_actual. Quedan ${remainingComparisons} comparaciones.`
        : `Sigue comparando con min_actual. Quedan ${remainingComparisons} comparaciones.`,
    };
  }

  // Todas las comparaciones completadas, colocar mínimo en posición i
  if (
    tempVariableArray.value.length === 1 &&
    comparisonsInCurrentIteration.value ===
      expectedComparisonsForIteration(currentIteration.value + 1)
  ) {
    return {
      type: 'success',
      title: '¡Mínimo encontrado!',
      text: `Ya comparaste todos los frascos. Arrastra min_actual a la posición ${currentIteration.value} (zona ordenada).`,
    };
  }

  // Siguiente iteración
  if (
    comparisonsInCurrentIteration.value === 0 &&
    tempVariableArray.value.length === 0 &&
    currentIteration.value > 0
  ) {
    return {
      type: 'info',
      title: `Iteración ${currentIteration.value + 1} de ${totalIterations.value}`,
      text: `Busca el siguiente mínimo en la zona de búsqueda (posiciones ${currentIteration.value} a 4). Arrastra un frasco a la balanza izquierda.`,
    };
  }

  // Mensaje por defecto
  return {
    type: 'info',
    title: 'Sigue comparando',
    text: 'Usa la balanza para comparar frascos y encuentra el más ligero.',
  };
});

// Watch para detectar interacción del usuario
watch([leftPanBottle, rightPanBottle, tempVariableArray], () => {
  if (!userHasInteracted.value) {
    if (
      leftPanBottle.value.length > 0 ||
      rightPanBottle.value.length > 0 ||
      tempVariableArray.value.length > 0
    ) {
      userHasInteracted.value = true;
    }
  }
});

// Function to get comparisons from iteration history
const getIterationComparisons = (iterNum: number): number => {
  const iteration = iterationHistory.value.find((it) => it.number === iterNum);
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
      rightState: null,
    };
  }

  // Caso 2: Solo frasco en platillo izquierdo - se inclina hacia la izquierda
  if (hasLeft && !hasRight) {
    return {
      barRotation: 'rotate(-8deg)',
      leftPanTransform: 'translateY(20px)',
      rightPanTransform: 'translateY(-20px)',
      leftState: 'heavier',
      rightState: null,
    };
  }

  // Caso 3: Solo frasco en platillo derecho - se inclina hacia la derecha
  if (!hasLeft && hasRight) {
    return {
      barRotation: 'rotate(8deg)',
      leftPanTransform: 'translateY(-20px)',
      rightPanTransform: 'translateY(20px)',
      leftState: null,
      rightState: 'heavier',
    };
  }

  // Caso 4: Dos frascos - usar resultado de comparación
  if (hasLeft && hasRight) {
    // Si el frasco izquierdo es más pesado (heavier), baja
    if (scaleResult.value.left === 'heavier') {
      return {
        barRotation: 'rotate(-8deg)',
        leftPanTransform: 'translateY(20px)', // El pesado BAJA
        rightPanTransform: 'translateY(-20px)', // El ligero SUBE
        leftState: scaleResult.value.left,
        rightState: scaleResult.value.right,
      };
    }
    // Si el frasco izquierdo es más ligero (lighter), sube
    else if (scaleResult.value.left === 'lighter') {
      return {
        barRotation: 'rotate(8deg)',
        leftPanTransform: 'translateY(-20px)', // El ligero SUBE
        rightPanTransform: 'translateY(20px)', // El pesado BAJA
        leftState: scaleResult.value.left,
        rightState: scaleResult.value.right,
      };
    }
    // Si el frasco derecho es más pesado (heavier), baja
    else if (scaleResult.value.right === 'heavier') {
      return {
        barRotation: 'rotate(8deg)',
        leftPanTransform: 'translateY(-20px)', // El ligero SUBE
        rightPanTransform: 'translateY(20px)', // El pesado BAJA
        leftState: scaleResult.value.left,
        rightState: scaleResult.value.right,
      };
    } else {
      // Igual o sin pesar aún
      return {
        barRotation: 'rotate(0deg)',
        leftPanTransform: 'translateY(0px)',
        rightPanTransform: 'translateY(0px)',
        leftState: scaleResult.value.left,
        rightState: scaleResult.value.right,
      };
    }
  }

  // Fallback
  return {
    barRotation: 'rotate(0deg)',
    leftPanTransform: 'translateY(0px)',
    rightPanTransform: 'translateY(0px)',
    leftState: null,
    rightState: null,
  };
});

// Watch for changes in pans to auto-weigh and auto-reset
watch([leftPanBottle, rightPanBottle], ([newLeft, newRight], [oldLeft, oldRight]) => {
  // VALIDACIÓN: Asegurar que solo haya UN elemento por platillo
  if (newLeft.length > 1) {
    const extraBottle = newLeft.pop();
    if (extraBottle) {
      const emptyIndex = workbenchBottles.value.findIndex((b) => b === null);
      if (emptyIndex !== -1) {
        workbenchBottles.value[emptyIndex] = extraBottle;
      }
    }
    showError('Solo un frasco por platillo.');
    return;
  }

  if (newRight.length > 1) {
    const extraBottle = newRight.pop();
    if (extraBottle) {
      const emptyIndex = workbenchBottles.value.findIndex((b) => b === null);
      if (emptyIndex !== -1) {
        workbenchBottles.value[emptyIndex] = extraBottle;
      }
    }
    showError('Solo un frasco por platillo.');
    return;
  }

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
});

// Drag-and-drop group configurations
const mainGroup = {
  name: 'bottles',
  pull: true,
  put: true,
};

// Grupo especial para la variable temporal: solo puede ir a posición i del array
const tempVariableGroup = {
  name: 'bottles',
  pull: true, // Permite mover el elemento (no clonar)
  put: true,
};

// Función para determinar el grupo según la posición
const getGroupForPosition = (index: number) => {
  // Zona ordenada: no permitir pull (sacar elementos) ni put (agregar elementos)
  if (index < currentIteration.value) {
    return {
      name: 'bottles',
      pull: false,
      put: false,
    };
  }
  // Zona no ordenada: permitir operaciones pero validar que esté vacía
  return {
    name: 'bottles',
    pull: true,
    put: () => {
      // Solo permitir agregar si la posición está vacía
      // Verificar si ya hay un frasco en esta posición
      const hasBottle = workbenchBottles.value[index] !== null;
      return !hasBottle;
    },
  };
};

const panGroup = computed(() => ({
  name: 'bottles',
  pull: true,
  put: (to: any) => {
    // RESTRICCIÓN 1: No permitir agregar si ya se pesó
    if (scaleWeighed.value) return false;

    // RESTRICCIÓN 2: Solo permitir UN elemento por platillo
    // Verificar si es el platillo izquierdo o derecho
    const targetList = to.el.getAttribute('data-pan');

    if (targetList === 'left' && leftPanBottle.value.length >= 1) {
      return false;
    }

    if (targetList === 'right' && rightPanBottle.value.length >= 1) {
      return false;
    }

    // Método alternativo: contar elementos hijos (el template header cuenta como 1)
    const childrenCount = to.el.children.length;
    return childrenCount < 2;
  },
}));

// Function to handle changes in temp variable zone
const handleTempVariableChange = (evt: {
  added?: { element: Bottle };
  removed?: { element: Bottle };
}) => {
  if (evt.added) {
    const addedBottle = evt.added.element as Bottle;

    // Limpiar mensaje del frasco inmediatamente al moverlo
    addedBottle.message = undefined;

    // RESTRICCIÓN: Solo permitir un frasco en temp variable
    if (tempVariableArray.value.length > 1) {
      setTimeout(() => {
        const extraBottle = tempVariableArray.value.pop();
        if (extraBottle) {
          const emptyIndex = workbenchBottles.value.findIndex((b) => b === null);
          if (emptyIndex !== -1) {
            workbenchBottles.value[emptyIndex] = extraBottle;
          }
          showError('Variable min_actual solo almacena un elemento.');
        }
      }, 100);
      return;
    }

    addedBottle.state = 'temp-variable';
    currentMinBottle.value = addedBottle;
    stats.movimientos++;
    showSuccess(`min_actual = Frasco ${addedBottle.id} (peso ${addedBottle.weight})`);
  }

  // Cuando se remueve un elemento, NO limpiar currentMinBottle
  // Esto mantiene la información visible pero sin el frasco físico
  if (evt.removed) {
    // currentMinBottle ya tiene el valor guardado, no hacer nada
    // El frasco físico se ha movido, pero la información permanece
  }
};

// Function to return bottle from temp variable on double-click
const returnBottleFromTemp = (bottleId: number) => {
  // Restringir: no permitir devolver min_actual al array
  showError(
    `No puedes devolver min_actual al array. Debes colocarlo en la posición i=${currentIteration.value}`,
  );
};

// Function to weigh bottles automatically (triggered when both pans have bottles)
const weighBottlesAutomatic = () => {
  const leftBottle = leftPanBottle.value[0];
  const rightBottle = rightPanBottle.value[0];

  if (!leftBottle || !rightBottle) return;

  // VALIDACIÓN: Verificar que el frasco derecho no haya sido comparado ya
  if (visitedBottlesInIteration.value.has(rightBottle.id)) {
    rightBottle.message = 'Frasco ya comparado. Selecciona otro.';
    showError('Este frasco ya fue comparado. Selecciona un frasco diferente.');
    setTimeout(() => {
      if (rightBottle.message) rightBottle.message = undefined;
    }, 3000);
    return;
  }

  // Agregar AMBOS frascos al conjunto de visitados
  // Esto evita que el frasco descartado vuelva a compararse
  visitedBottlesInIteration.value.add(leftBottle.id);
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
        rightBottle.message = `Mínimo final (${comparisonsInCurrentIteration.value}/${expectedComparisons}). Mueve a posición i.`;
        leftBottle.message = 'Devolver al array.';
      } else {
        rightBottle.message = `Nuevo mínimo encontrado (${comparisonsInCurrentIteration.value}/${expectedComparisons}). Mueve a Variable Temporal.`;
        leftBottle.message = 'Devolver al array.';
      }
    } else if (rightBottle.weight > leftBottle.weight) {
      // CASO B: El frasco derecho (nuevo) es MAYOR - Descartar
      if (isLastComparison) {
        leftBottle.message = `Mínimo confirmado (${comparisonsInCurrentIteration.value}/${expectedComparisons}). Mueve a posición i.`;
        rightBottle.message = 'Devolver al array.';
      } else {
        rightBottle.message = `Descartado (${comparisonsInCurrentIteration.value}/${expectedComparisons}). Devolver al array.`;
        // Verificar si es la primera comparación de la iteración
        if (comparisonsInCurrentIteration.value === 1) {
          leftBottle.message = 'Mínimo encontrado. Mueve a Variable Temporal.';
        } else {
          leftBottle.message = 'Aún soy el mínimo. Continúa comparando.';
        }
      }
    } else {
      // Empate
      if (isLastComparison) {
        rightBottle.message = `Pesos iguales (${comparisonsInCurrentIteration.value}/${expectedComparisons}). Cualquiera puede ir a posición i.`;
        leftBottle.message = `Pesos iguales (${comparisonsInCurrentIteration.value}/${expectedComparisons}).`;
      } else {
        rightBottle.message = `Pesos iguales (${comparisonsInCurrentIteration.value}/${expectedComparisons}). Cualquiera vale como mínimo.`;
        leftBottle.message = `Pesos iguales (${comparisonsInCurrentIteration.value}/${expectedComparisons}).`;
      }
    }

    scaleWeighed.value = false;
  }, 700); // Esperar exactamente el tiempo de la animación física (700ms)
};

// Function to validate and add bottle to sorted shelf
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
      const emptyIndex = workbenchBottles.value.findIndex((b) => b === null);
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
      const emptyIndex = workbenchBottles.value.findIndex((b) => b === null);
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

  // Reset user interaction flag
  userHasInteracted.value = false;

  showSuccess('Algoritmo reiniciado. Coloca un frasco en cada platillo para comenzar.');
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
  0%,
  100% {
    transform: translateX(0);
  }
  10%,
  30%,
  50%,
  70%,
  90% {
    transform: translateX(-10px);
  }
  20%,
  40%,
  60%,
  80% {
    transform: translateX(10px);
  }
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
  transition: all 0.3s ease-in-out;
}

.array-slot:last-child {
  border-right: none;
}

/* Estados visuales del array slot */
.array-slot-completed {
  background: linear-gradient(to bottom, rgba(34, 197, 94, 0.2), rgba(34, 197, 94, 0.1));
  border-right: 2px solid #22c55e;
  box-shadow: inset 0 2px 4px rgba(34, 197, 94, 0.1);
}

.array-slot-searching {
  background: linear-gradient(to bottom, rgba(168, 85, 247, 0.25), rgba(168, 85, 247, 0.15));
  border: 3px solid #a855f7;
  animation: pulse-slot 1.5s ease-in-out infinite;
  position: relative;
}

.array-slot-border-zone {
  border: 4px solid #7c3aed !important;
  border-radius: 8px;
  margin: 0 4px;
  box-shadow: 0 0 0 2px rgba(124, 58, 237, 0.2);
}

.array-slot-current {
  background: linear-gradient(to bottom, rgba(251, 191, 36, 0.15), rgba(251, 191, 36, 0.08));
  border-right: 2px solid #fbbf24;
}

@keyframes pulse-slot {
  0%,
  100% {
    box-shadow: 0 0 0 0 rgba(168, 85, 247, 0.4);
  }
  50% {
    box-shadow: 0 0 0 8px rgba(168, 85, 247, 0);
  }
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
  transition: all 0.3s ease-in-out;
}

.index-box-completed {
  background: linear-gradient(to bottom, #86efac, #4ade80);
  color: #166534;
}

.index-box-searching {
  background: linear-gradient(to bottom, #c084fc, #a855f7);
  color: white;
  animation: pulse-index 1.5s ease-in-out infinite;
}

@keyframes pulse-index {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

.index-box-sorted {
  background: linear-gradient(to bottom, #22c55e, #16a34a);
}

.index-box-inner-loop {
  background: linear-gradient(to bottom, #c084fc, #a855f7);
  color: white;
  border: 2px solid #a855f7;
}
</style>
