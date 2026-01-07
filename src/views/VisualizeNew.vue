<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 overflow-hidden">
    <!-- Title -->
    <div class="text-center py-3 bg-white/80 shadow-sm border-b border-gray-200">
      <h1 class="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
        SELECTION SORT - Algoritmo de Ordenamiento por Selección
      </h1>
      <p class="text-gray-600 mt-1 text-xs">Aprende cómo funciona el algoritmo visualizando el proceso paso a paso</p>
    </div>

    <div class="container mx-auto px-2 py-1 h-[calc(100vh-85px)] flex flex-col gap-2">
      <!-- Top Row: 3 small boxes -->
      <div class="grid grid-cols-12 gap-2 h-[35%]">
        <!-- MEMORIA -->
        <div class="col-span-4 bg-white rounded-lg shadow-md p-2 border border-purple-200 overflow-auto">
          <h3 class="text-sm font-bold text-purple-700 mb-1 flex items-center gap-1">
            <span>🧠</span>
            <span>MEMORIA</span>
          </h3>
          
          <!-- Array -->
          <p class="text-[10px] text-gray-600 font-semibold mb-1">Array[]:</p>
          <div class="grid grid-cols-5 gap-0.5 mb-2">
            <div v-for="(value, idx) in memoryArray" :key="'mem-' + idx" 
                 class="border rounded p-1 text-center text-[10px] font-mono"
                 :class="{
                   'border-green-500 bg-green-50': idx < currentIteration,
                   'border-yellow-400 bg-yellow-50': idx === minIndex && idx >= currentIteration,
                   'border-cyan-400 bg-cyan-50': idx === (currentIteration + currentCompareIndex) && idx >= currentIteration && idx !== minIndex,
                   'border-gray-300 bg-gray-50': idx >= currentIteration && idx !== minIndex && idx !== (currentIteration + currentCompareIndex)
                 }">
              <div class="text-[8px] text-gray-500">[{{ idx }}]</div>
              <div class="font-bold text-sm" :class="idx < currentIteration ? 'text-green-700' : 'text-gray-800'">
                {{ value !== null ? value : '-' }}
              </div>
            </div>
          </div>
          
          <!-- Legend mejorada -->
          <div class="grid grid-cols-3 gap-2 mb-3 text-xs">
            <div class="flex items-center gap-1 bg-green-50 px-2 py-1 rounded border border-green-300">
              <div class="w-4 h-4 bg-green-500 rounded-full"></div>
              <span class="font-semibold text-green-800">Ordenados</span>
            </div>
            <div class="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded border border-yellow-300">
              <div class="w-4 h-4 bg-yellow-500 rounded-full"></div>
              <span class="font-semibold text-yellow-800">Menor actual</span>
            </div>
            <div class="flex items-center gap-1 bg-cyan-50 px-2 py-1 rounded border border-cyan-300">
              <div class="w-4 h-4 bg-cyan-500 rounded-full"></div>
              <span class="font-semibold text-cyan-800">A comparar</span>
            </div>
          </div>

          <!-- min_index -->
          <div class="bg-amber-50 border border-amber-400 rounded p-1.5 mb-1">
            <p class="text-[10px] font-bold text-amber-800">min_index = <span class="text-lg">{{ minIndex !== null ? minIndex : '?' }}</span></p>
          </div>

          <!-- temp -->
          <div class="border rounded p-1.5"
               :class="tempUsed ? 'bg-green-50 border-green-500' : 'bg-gray-50 border-gray-300 opacity-40'">
            <p class="text-[10px] font-bold" :class="tempUsed ? 'text-green-800' : 'text-gray-400'">
              temp = <span class="text-lg">{{ tempValue !== null ? tempValue : '-' }}</span>
            </p>
          </div>
        </div>

        <!-- COMPLEJIDAD -->
        <div class="col-span-4 bg-white rounded-lg shadow-md p-2 border border-blue-200">
          <h3 class="text-sm font-bold text-blue-700 mb-2 flex items-center gap-1">
            <span>📊</span>
            <span>COMPLEJIDAD</span>
          </h3>
          
          <div class="space-y-1">
            <div class="bg-blue-50 rounded p-1.5 text-center">
              <p class="text-[10px] text-blue-700">Comparaciones:</p>
              <p class="text-2xl font-extrabold text-blue-600">{{ comparisons }}</p>
            </div>
            
            <div class="bg-purple-50 rounded p-1.5 text-center">
              <p class="text-[10px] text-purple-700">Intercambios:</p>
              <p class="text-2xl font-extrabold text-purple-600">{{ swaps }}</p>
            </div>
            
            <div class="bg-gray-50 rounded p-1.5 text-center">
              <p class="text-[10px] text-gray-700">Iteración:</p>
              <p class="text-xl font-extrabold text-gray-600">{{ currentIteration + 1 }} / {{ totalIterations }}</p>
            </div>
          </div>
        </div>

        <!-- MENOR ACTUAL -->
        <div class="col-span-4 rounded-lg shadow-md p-2 border-2 transition-all duration-300"
             :class="waitingForNewMinDrag ? 'bg-yellow-100 border-yellow-500 animate-pulse shadow-yellow-500/50 shadow-2xl' : 'bg-yellow-50 border-yellow-400'">
          <h3 class="text-sm font-bold text-yellow-800 mb-1 text-center flex items-center justify-center gap-1">
            <span>🏆</span>
            <span>MENOR ACTUAL (min_actual)</span>
          </h3>
          <div class="flex flex-col items-center justify-center h-[calc(100%-30px)]"
               @drop="onDropOnMinBox($event)"
               @dragover="onDragOver">
            <Bottle
              v-if="minBottle"
              :id="minBottle.id"
              :weight="minBottle.weight"
              :color="minBottle.color"
              state="temp-variable"
            />
            <div v-else class="text-yellow-400 text-3xl">?</div>
            <p class="text-[10px] text-center text-yellow-700 mt-1">
              {{ minBottle ? `Índice: ${minIndex} | Peso: ${minBottle.weight}` : 'Esperando...' }}
            </p>
          </div>
        </div>
      </div>

      <!-- Messages & Instruction -->
      <div v-if="message || instructionHint" class="p-2 rounded text-center text-sm font-semibold"
           :class="{
             'bg-red-100 border border-red-400 text-red-800': messageType === 'error',
             'bg-green-100 border border-green-400 text-green-800': messageType === 'success',
             'bg-blue-100 border border-blue-400 text-blue-800': messageType === 'info' || instructionHint
           }">
        {{ message || instructionHint }}
      </div>

      <!-- Bottom Row: Lista de Frascos + Balanza -->
      <div class="grid grid-cols-12 gap-2 flex-1">
        <!-- Left Column: Bottle List -->
        <div class="col-span-8 bg-white rounded-lg shadow-lg p-3 border-2 border-blue-300 transition-all duration-300"
             :class="{ 'ring-4 ring-blue-400 ring-opacity-50 shadow-[0_0_15px_rgba(59,130,246,0.5)]': isInitialState }">
          <div class="flex items-center justify-between mb-2">
            <h3 class="text-base font-bold text-blue-700 flex items-center gap-2">
              LISTA DE FRASCOS
              <span v-if="isInitialState" class="flex h-3 w-3 relative">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
              </span>
            </h3>
            <div class="flex gap-4 text-sm">
              <!-- Counters -->
              <div class="flex gap-3">
                <div class="flex items-center gap-1">
                  <span class="text-green-600 font-bold text-base">✓</span>
                  <span class="font-semibold">Ordenados: {{ currentIteration }}</span>
                </div>
                <div class="flex items-center gap-1">
                  <span class="text-orange-600 font-bold text-base">📋</span>
                  <span class="font-semibold">Desordenados: {{ 5 - currentIteration }}</span>
                </div>
              </div>
              <!-- Color meanings -->
              <div class="border-l-2 border-gray-300 pl-3 flex gap-3">
                <div class="flex items-center gap-1">
                  <div class="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span class="font-semibold text-yellow-700">Menor</span>
                </div>
                <div class="flex items-center gap-1">
                  <div class="w-3 h-3 bg-cyan-500 rounded-full"></div>
                  <span class="font-semibold text-cyan-700">A comparar</span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="bg-gradient-to-r from-green-50 via-gray-50 to-amber-50 rounded-lg p-2 h-[calc(100%-60px)]">
            <div class="relative flex gap-12 justify-center items-center h-full">
              <div v-for="(bottle, idx) in allBottles" :key="'unified-' + idx" 
                   class="relative flex flex-col items-center justify-center transform scale-150"
                   :class="{
                     'mr-6': idx === currentIteration - 1 && currentIteration > 0 && currentIteration < 5,
                     'ml-6': idx === currentIteration && currentIteration > 0
                   }">
                
                <!-- Highlight for menor actual -->
                <!-- Highlight for menor actual -->
                <div v-if="(idx === minIndex && !waitingForNewMinDrag && idx >= currentIteration) || (waitingForNewMinDrag && idx === pendingNewMinIndex) || (waitingForSwapDrag && idx === minIndex)" 
                     class="absolute inset-0 -m-2 bg-yellow-400/30 rounded-lg border-2 border-yellow-500 animate-pulse z-0"></div>
                
                <!-- Highlight for element to compare (HIDE during swap/newMin wait) -->
                <div v-if="!waitingForNewMinDrag && !waitingForSwapDrag && idx === (currentIteration + currentCompareIndex) && idx >= currentIteration && idx !== minIndex" 
                     class="absolute inset-0 -m-2 bg-cyan-400/30 rounded-lg border-2 border-cyan-500 animate-pulse z-0"></div>

                <!-- Highlight for SWAP DESTINATION -->
                <div v-if="waitingForSwapDrag && idx === currentIteration"
                     class="absolute inset-0 -m-2 bg-green-100/30 rounded-lg border-4 border-green-500 border-dashed animate-pulse z-0">
                     <div class="absolute -top-6 w-full text-center text-xs font-bold text-green-700 bg-white shadow rounded px-1">APLICA AQUÍ</div>
                </div>
                
                <Bottle
                  v-if="bottle"
                  :id="bottle.id"
                  :weight="bottle.weight"
                  :color="bottle.color"
                  :shouldShake="shouldShakeBottle(idx)"
                  :dimmed="shouldDimBottle(idx)"
                  :state="idx < currentIteration ? 'consolidated' : 'normal'"
                  @bottle-clicked="onBottleClick(idx)"
                  @dragstart="onDragStart($event, idx)"
                  @drop="onDropOnBottle($event, idx)"
                  @dragover="onDragOver"
                  @dragend="onDragEnd"
                  class="relative z-10"
                />
                
                <div class="text-center mt-1 text-xs font-bold"
                     :class="idx < currentIteration ? 'text-green-700' : 'text-gray-600'">
                  {{ idx }}
                </div>
                
                <div v-if="idx < currentIteration" class="text-[10px] text-green-600 mt-0.5">✓</div>
                
                <!-- Partition line (ajustada) -->
                <div v-if="idx === currentIteration - 1 && currentIteration > 0 && currentIteration < 5" 
                     class="absolute -right-4 top-2 bottom-6 flex items-center z-10">
                  <div class="w-1 h-full bg-gradient-to-b from-gray-700 via-gray-900 to-gray-700 rounded-full shadow-lg"></div>
                </div>
              </div>
            </div>
            
            <!-- Labels -->
            <div v-if="currentIteration > 0" class="flex justify-around mt-2 text-[10px] font-bold">
              <span class="text-green-700">✅ ORDENADO</span>
              <span v-if="currentIteration < 5" class="text-orange-700">📋 DESORDENADO</span>
            </div>
          </div>
        </div>

        <!-- Right Column: BALANZA + Controls -->
        <div class="col-span-4 flex flex-col gap-2">
          <!-- BALANZA -->
          <div class="bg-white rounded-lg shadow-md p-2 border border-gray-300 flex-1 relative transition-all duration-300"
               :class="{ 
                 'opacity-30 pointer-events-none': waitingForNewMinDrag || waitingForSwapDrag,
                 'ring-4 ring-blue-400 ring-opacity-50 shadow-[0_0_15px_rgba(59,130,246,0.5)]': isInitialState && !waitingForNewMinDrag
               }">
            <h3 class="text-sm font-bold text-gray-700 mb-1 text-center flex justify-center items-center gap-2">
              <span>⚖️</span> 
              <span>BALANZA</span>
              <span v-if="isInitialState" class="flex h-3 w-3 relative">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
              </span>
            </h3>
            
            <div class="relative h-[calc(100%-60px)] flex flex-col items-center justify-center">
              <!-- Base -->
              <div class="absolute bottom-0 w-28 h-4 bg-gradient-to-b from-gray-500 to-gray-700 rounded shadow-lg"></div>
              
              <!-- Vertical Support -->
              <div class="absolute bottom-4 w-4 h-28 bg-gradient-to-r from-gray-500 via-gray-400 to-gray-500 rounded-t shadow-md"></div>
              
              <!-- Fulcrum (pivot point at top of support) -->
              <div class="absolute bottom-[124px] w-7 h-7 bg-gray-800 rounded-full border-2 border-gray-900 shadow-lg z-30"></div>
              
              <!-- Horizontal Beam (rotates around fulcrum) -->
              <div class="absolute bottom-[126px] w-64 h-2 bg-gradient-to-r from-gray-600 via-gray-500 to-gray-600 rounded-full shadow-md transition-transform duration-700 origin-center z-20"
                   :class="{ 'animate-sway': isInitialState }"
                   :style="{ transform: scaleRotation }">
                
                <!-- Left end circle -->
                <div class="absolute -left-1 -top-1 w-4 h-4 bg-gray-700 rounded-full border border-gray-800"></div>
                
                <!-- Right end circle -->
                <div class="absolute -right-1 -top-1 w-4 h-4 bg-gray-700 rounded-full border border-gray-800"></div>
              </div>
              
              <!-- Left Pan Assembly -->
              <div class="absolute left-8 bottom-[126px] flex flex-col items-center transition-all duration-700"
                   :style="{ transform: leftPanTransform }">
                
                <!-- Drop zone -->
                <div 
                  class="w-24 h-32 flex flex-col items-center justify-center"
                  @drop="onDropOnScale($event, 'left')"
                  @dragover="onDragOver">
                  <!-- Bottle container (arriba) -->
                  <div class="min-h-[70px] flex items-center justify-center">
                    <Bottle
                      v-if="leftBottle"
                      :id="leftBottle.id"
                      :weight="leftBottle.weight"
                      :color="leftBottle.color"
                      :comparison="scaleResult?.left"
                      state="comparing"
                    />
                  </div>
                  <!-- Platillo (debajo del frasco) -->
                  <div class="w-20 h-5 rounded-full bg-gradient-to-b from-yellow-300 via-yellow-400 to-yellow-500 border-2 border-yellow-600 shadow-lg mt-1"
                       style="transform: perspective(100px) rotateX(60deg);">
                  </div>
                </div>
              </div>
              
              <!-- Right Pan Assembly -->
              <div class="absolute right-8 bottom-[126px] flex flex-col items-center transition-all duration-700"
                   :style="{ transform: rightPanTransform }">
                
                <!-- Drop zone -->
                <div 
                  class="w-24 h-32 flex flex-col items-center justify-center"
                  @drop="onDropOnScale($event, 'right')"
                  @dragover="onDragOver">
                  <!-- Bottle container (arriba) -->
                  <div class="min-h-[70px] flex items-center justify-center">
                    <Bottle
                      v-if="rightBottle"
                      :id="rightBottle.id"
                      :weight="rightBottle.weight"
                      :color="rightBottle.color"
                      :comparison="scaleResult?.right"
                      state="comparing"
                    />
                  </div>
                  <!-- Platillo (debajo del frasco) -->
                  <div class="w-20 h-5 rounded-full bg-gradient-to-b from-yellow-300 via-yellow-400 to-yellow-500 border-2 border-yellow-600 shadow-lg mt-1"
                       style="transform: perspective(100px) rotateX(60deg);">
                  </div>
                </div>
              </div>
            </div>
            
            <div class="mt-2 text-center">
              <button
                v-if="scaleWeighed"
                @click="clearScale"
                class="px-4 py-1.5 text-sm rounded font-bold text-white bg-gray-600 hover:bg-gray-700 shadow">
                LIMPIAR
              </button>
              <p v-else class="text-[10px] text-gray-500">Arrastra los frascos a la balanza</p>
            </div>
          </div>

          <!-- REINICIAR Button -->
          <button
            @click="resetAlgorithm"
            class="px-4 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg shadow-lg transition-all flex items-center justify-center gap-2">
            <span>🔄</span>
            <span>REINICIAR</span>
          </button>

          <!-- Completar Test Button (when finished) -->
          <button
            v-if="isComplete"
            @click="showQuiz = true"
            class="px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold rounded-lg shadow-lg transition-all flex items-center justify-center gap-2">
            <span>✅</span>
            <span>REALIZAR TEST</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import Bottle from '../components/Bottle.vue';

interface Bottle {
  id: number;
  weight: number;
  color: string;
}

type ComparisonState = 'heavier' | 'lighter' | 'equal' | null;

// State
const unsortedBottles = ref<(Bottle | null)[]>([]);
const sortedBottles = ref<(Bottle | null)[]>([null, null, null, null, null]);

const leftBottle = ref<Bottle | null>(null);
const rightBottle = ref<Bottle | null>(null);
const currentCompareLeft = ref<number | null>(null);
const currentCompareRight = ref<number | null>(null);

const minIndex = ref<number | null>(null);
const minBottle = ref<Bottle | null>(null);
const tempValue = ref<number | null>(null);
const tempUsed = ref(false);

const currentIteration = ref(0);
const currentCompareIndex = ref(0);
const comparisons = ref(0);
const swaps = ref(0);

const scaleResult = ref<{ left: ComparisonState; right: ComparisonState } | null>(null);
const scaleWeighed = ref(false);

const message = ref('');
const messageType = ref<'error' | 'success' | 'info'>('info');
const instructionHint = ref('');

const isComplete = ref(false);
const showQuiz = ref(false);

// Drag and drop state
const draggedBottleIndex = ref<number | null>(null);
const waitingForNewMinDrag = ref(false); // true when waiting for user to drag new min to box
const pendingNewMinBottle = ref<Bottle | null>(null); // temporary storage for new min before drag
const pendingNewMinIndex = ref<number | null>(null); // temporary storage for new min index
const waitingForSwapDrag = ref(false); // true when waiting for swap at end of iteration

// Watch for auto-weighing when both bottles are on scale
watch([leftBottle, rightBottle], ([left, right]) => {
  if (left && right && !scaleWeighed.value) {
    // Auto weigh after a short delay
    setTimeout(() => {
      weighBottles();
    }, 500);
  }
});

// Initialize
const initializeBottles = () => {
  const bottles: Bottle[] = [];
  for (let i = 0; i < 5; i++) {
    bottles.push({
      id: i + 1,
      weight: Math.floor(Math.random() * 80) + 20,
      color: 'bg-blue-300',
    });
  }
  unsortedBottles.value = bottles;
  sortedBottles.value = [null, null, null, null, null];
  
  currentIteration.value = 0;
  currentCompareIndex.value = 1;
  comparisons.value = 0;
  swaps.value = 0;
  
  // Initialize minIndex with first element of unsorted part
  minIndex.value = 0;
  minBottle.value = bottles[0];
  
  // Reset waiting and temp states completely
  tempValue.value = null;
  tempUsed.value = false;
  leftBottle.value = null;
  rightBottle.value = null;
  scaleWeighed.value = false;
  scaleResult.value = null;
  isComplete.value = false;
  
  waitingForNewMinDrag.value = false;
  pendingNewMinBottle.value = null;
  pendingNewMinIndex.value = null;
  waitingForSwapDrag.value = false;
  
  showMessage('Selection Sort: Siempre comparas el MENOR ACTUAL con el siguiente elemento.', 'info');
  setInstruction(`El menor actual es índice ${minIndex.value}. Arrastra los dos elementos: el menor actual (amarillo) y el a comparar (cyan) a la balanza.`);
};

const totalIterations = computed(() => 4);

// Unified memory array representation
const memoryArray = computed(() => {
  const array: (number | null)[] = [];
  
  for (let i = 0; i < 5; i++) {
    if (i < currentIteration.value && sortedBottles.value[i]) {
      array.push(sortedBottles.value[i]!.weight);
    } else {
      const bottle = unsortedBottles.value[i];
      array.push(bottle ? bottle.weight : null);
    }
  }
  
  return array;
});

// All bottles in a single unified list for display
const allBottles = computed(() => {
  const bottles: (Bottle | null)[] = [];
  
  for (let i = 0; i < 5; i++) {
    if (i < currentIteration.value) {
      bottles.push(sortedBottles.value[i]);
    } else {
      bottles.push(unsortedBottles.value[i]);
    }
  }
  
  return bottles;
});

const isInitialState = computed(() => {
  return currentIteration.value === 0 && 
         currentCompareIndex.value === 1 && 
         comparisons.value === 0 && 
         !leftBottle.value && 
         !rightBottle.value;
});

const canWeigh = computed(() => {
  return leftBottle.value !== null && rightBottle.value !== null && !scaleWeighed.value;
});

const scaleRotation = computed(() => {
  if (!scaleResult.value) return 'rotate(0deg)';
  if (scaleResult.value.left === 'heavier') return 'rotate(-8deg)';
  if (scaleResult.value.right === 'heavier') return 'rotate(8deg)';
  return 'rotate(0deg)';
});

const leftPanTransform = computed(() => {
  if (!scaleResult.value) return 'translateY(0)';
  if (scaleResult.value.left === 'heavier') return 'translateY(24px)';
  if (scaleResult.value.left === 'lighter') return 'translateY(-24px)';
  return 'translateY(0)';
});

const rightPanTransform = computed(() => {
  if (!scaleResult.value) return 'translateY(0)';
  if (scaleResult.value.right === 'heavier') return 'translateY(24px)';
  if (scaleResult.value.right === 'lighter') return 'translateY(-24px)';
  return 'translateY(0)';
});

// Shake both the min and the element to compare
const shouldShakeBottle = (index: number) => {
  // If waiting for drag of new min, ONLY shake the pending new min
  if (waitingForNewMinDrag.value) {
    return index === pendingNewMinIndex.value;
  }
  
  if (waitingForSwapDrag.value) {
    return index === minIndex.value;
  }

  const nextToCompare = currentIteration.value + currentCompareIndex.value;
  const unsortedCount = 5 - currentIteration.value;
  
  if (currentCompareIndex.value >= unsortedCount) return false;
  
  // Shake if no bottles on scale and this is either the min or the next to compare
  return (index === nextToCompare || index === minIndex.value) && 
         leftBottle.value === null && 
         rightBottle.value === null &&
         index >= currentIteration.value;
};

const shouldDimBottle = (index: number) => {
  if (minIndex.value === null) return false;
  
  const nextToCompare = currentIteration.value + currentCompareIndex.value;
  const unsortedCount = 5 - currentIteration.value;
  
  if (currentCompareIndex.value < unsortedCount) {
    return index !== minIndex.value && index !== nextToCompare && index >= currentIteration.value;
  }
  
  return false;
};

const showMessage = (msg: string, type: 'error' | 'success' | 'info' = 'info') => {
  message.value = msg;
  messageType.value = type;
  setTimeout(() => {
    message.value = '';
  }, 4000);
};

const setInstruction = (hint: string) => {
  instructionHint.value = hint;
};

const onBottleClick = (index: number) => {
  // Solo feedback visual para indicar que deben arrastrar
  showMessage('👆 Arrastra los frascos a la balanza para compararlos.', 'info');
};

// Drag and Drop Functions
const onDragStart = (event: DragEvent, index: number) => {
  const bottle = unsortedBottles.value[index];
  if (!bottle || index < currentIteration.value) return;
  
  draggedBottleIndex.value = index;
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('bottleIndex', index.toString());
  }
};

const onDragEnd = () => {
  draggedBottleIndex.value = null;
};

const onDropOnScale = (event: DragEvent, pan: 'left' | 'right') => {
  event.preventDefault();
  
  const index = draggedBottleIndex.value;
  if (index === null) return;
  
  const bottle = unsortedBottles.value[index];
  if (!bottle) return;
  
  const expectedToCompare = currentIteration.value + currentCompareIndex.value;
  
  if (pan === 'left') {
    if (index === minIndex.value) {
      leftBottle.value = bottle;
      currentCompareLeft.value = index;
      setInstruction('Ahora arrastra el frasco a comparar al lado derecho de la balanza.');
    } else {
      showMessage('⚠️ El lado izquierdo de la balanza es para el MENOR ACTUAL.', 'error');
    }
  } else if (pan === 'right') {
    if (index === expectedToCompare) {
      rightBottle.value = bottle;
      currentCompareRight.value = index;
      
      if (!leftBottle.value && minBottle.value && minIndex.value !== null) {
        leftBottle.value = minBottle.value;
        currentCompareLeft.value = minIndex.value;
      }
      
      setInstruction('¡Perfecto! La balanza pesará automáticamente.');
    } else {
      showMessage(`⚠️ Debes arrastrar el frasco índice ${expectedToCompare} para comparar.`, 'error');
    }
  }
  
  draggedBottleIndex.value = null;
};

const onDragOver = (event: DragEvent) => {
  event.preventDefault();
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'move';
  }
};

const onScalePanClick = (pan: 'left' | 'right') => {
  // Optional: handle click on pans
};

const onDropOnMinBox = (event: DragEvent) => {
  event.preventDefault();
  
  const index = draggedBottleIndex.value;
  if (index === null) return;
  
  // Only accept when waiting for new min drag
  if (!waitingForNewMinDrag.value) {
    showMessage('⚠️ Solo puedes arrastrar aquí cuando encuentres un nuevo menor.', 'error');
    return;
  }
  
  // Check if correct bottle
  if (index !== pendingNewMinIndex.value) {
    showMessage(`⚠️ Debes arrastrar el frasco índice ${pendingNewMinIndex.value} que es el nuevo menor.`, 'error');
    return;
  }
  
  // Success! Now update minBottle and minIndex
  waitingForNewMinDrag.value = false;
  minBottle.value = pendingNewMinBottle.value;
  minIndex.value = pendingNewMinIndex.value;
  pendingNewMinBottle.value = null;
  pendingNewMinIndex.value = null;
  
  showMessage('✅ Correcto! Nuevo menor actualizado. Continuando...', 'success');
  
  setTimeout(() => {
    proceedToNextComparison();
  }, 1500);
};

const onDropOnBottle = (event: DragEvent, targetIndex: number) => {
  event.preventDefault();
  
  // Only active when waiting for swap
  if (!waitingForSwapDrag.value) return;

  const draggedIndex = draggedBottleIndex.value;
  if (draggedIndex === null) return;
  
  const minIdx = minIndex.value;
  const targetPos = currentIteration.value;
  
  // Validar drop correcto: Arrastró el MIN hacia la posición inicial
  if (draggedIndex === minIdx && targetIndex === targetPos) {
      waitingForSwapDrag.value = false;
      showMessage('✅ Correcto! Realizando intercambio...', 'success');
      finalizeIterationLogic();
  } else {
      if (draggedIndex !== minIdx) {
         showMessage(`⚠️ Debes arrastrar el frasco MENOR (índice ${minIdx}).`, 'error');
      } else {
         showMessage(`⚠️ Debes soltarlo en la posición inicial (índice ${targetPos}).`, 'error');
      }
  }
};

const clearScale = () => {
  leftBottle.value = null;
  rightBottle.value = null;
  currentCompareLeft.value = null;
  currentCompareRight.value = null;
  scaleWeighed.value = false;
  scaleResult.value = null;
};

const weighBottles = () => {
  if (!canWeigh.value || !leftBottle.value || !rightBottle.value) return;
  
  comparisons.value++;
  scaleWeighed.value = true;
  
  const leftWeight = leftBottle.value.weight;
  const rightWeight = rightBottle.value.weight;
  
  if (leftWeight > rightWeight) {
    scaleResult.value = { left: 'heavier', right: 'lighter' };
    showMessage(`El menor actual (${leftWeight}) es MÁS PESADO. Se encontró un nuevo menor: ${rightWeight}`, 'info');
    
    setTimeout(() => {
      // NO actualizar minBottle/minIndex aún, solo guardar temporalmente
      pendingNewMinBottle.value = rightBottle.value;
      pendingNewMinIndex.value = currentCompareRight.value;
      waitingForNewMinDrag.value = true;
      showMessage('✅ Nuevo menor encontrado! Arrastra este frasco al cuadro "MENOR ACTUAL" pulsante', 'success');
      setInstruction(`Arrastra el frasco índice ${currentCompareRight.value} (peso: ${rightWeight}) al MENOR ACTUAL.`);
    }, 2000);
  } else if (rightWeight > leftWeight) {
    scaleResult.value = { left: 'lighter', right: 'heavier' };
    showMessage(`⚓ No se encontró un nuevo menor. El menor actual (${leftWeight}) se mantiene.`, 'info');
    setTimeout(() => {
      proceedToNextComparison();
    }, 3500);
  } else {
    scaleResult.value = { left: 'equal', right: 'equal' };
    showMessage('⚖️️ Mismo peso. El menor actual se mantiene.', 'info');
    setTimeout(() => {
      proceedToNextComparison();
    }, 3500);
  }
};

const proceedToNextComparison = () => {
  if (leftBottle.value && currentCompareLeft.value !== null) {
    unsortedBottles.value[currentCompareLeft.value] = leftBottle.value;
  }
  if (rightBottle.value && currentCompareRight.value !== null) {
    unsortedBottles.value[currentCompareRight.value] = rightBottle.value;
  }
  
  leftBottle.value = null;
  rightBottle.value = null;
  scaleWeighed.value = false;
  scaleResult.value = null;
  currentCompareLeft.value = null;
  currentCompareRight.value = null;
  
  currentCompareIndex.value++;
  
  const unsortedCount = 5 - currentIteration.value;
  
  if (currentCompareIndex.value >= unsortedCount) {
    completeIteration();
  } else {
    const nextIndex = currentIteration.value + currentCompareIndex.value;
    setInstruction(`El menor actual es índice ${minIndex.value}. Arrastra los dos elementos: el menor actual (amarillo) y el a comparar (cyan) a la balanza.`);
  }
};

const completeIteration = () => {
  if (!minBottle.value || minIndex.value === null) {
    showMessage('Error: No se encontró un mínimo en esta iteración', 'error');
    return;
  }
  
  const firstUnsortedIndex = currentIteration.value;
  
  // Si el menor NO es el primero de la lista desordenada, pedir SWAP manual
  if (minIndex.value !== firstUnsortedIndex) {
    waitingForSwapDrag.value = true;
    showMessage(`🔄 Fin de comparación. Arrastra el MENOR (índice ${minIndex.value}) a la posición inicial (índice ${firstUnsortedIndex}) para intercambiarlos.`, 'success');
    setInstruction(`Arrastra el frasco MENOR (amarillo flotante) hacia la posición ${firstUnsortedIndex} para hacer el intercambio.`);
    return;
  }
  
  // Si ya está en su sitio
  showMessage('✅ El menor ya está en la posición correcta.', 'success');
  setTimeout(() => {
    finalizeIterationLogic();
  }, 1000);
};

const finalizeIterationLogic = () => {
  const firstUnsortedIndex = currentIteration.value;
  const minBottleValue = minBottle.value;
  const firstBottle = unsortedBottles.value[firstUnsortedIndex];
  
  if (!firstBottle || !minBottleValue) return;
  
  // Ejecutar el swap (lógico y visual)
  tempValue.value = firstBottle.weight; // Solo interno
  tempUsed.value = true;
  
  unsortedBottles.value[firstUnsortedIndex] = minBottleValue;
  unsortedBottles.value[minIndex.value!] = firstBottle;
  
  swaps.value++;
  
  setTimeout(() => {
    // Mover a sorted
    const minToSort = unsortedBottles.value[firstUnsortedIndex];
    if (minToSort) {
      sortedBottles.value[currentIteration.value] = minToSort;
      unsortedBottles.value[firstUnsortedIndex] = null;
    }
    
    tempValue.value = null;
    tempUsed.value = false;
    
    currentIteration.value++;
    currentCompareIndex.value = 1;
    
    if (currentIteration.value >= totalIterations.value) {
      finishSort();
    } else {
      const newFirstIndex = currentIteration.value;
      minIndex.value = newFirstIndex;
      minBottle.value = unsortedBottles.value[newFirstIndex];
      
      showMessage(`✅ Iteración completada. Nuevo menor inicial: índice ${minIndex.value}`, 'info');
      setInstruction(`Iteración ${currentIteration.value + 1}: Arrastra los dos elementos: el menor actual (amarillo) y el a comparar (cyan) a la balanza.`);
    }
  }, 1000);
};

const finishSort = () => {
  const remaining = unsortedBottles.value.filter(b => b !== null);
  if (remaining.length === 1) {
    sortedBottles.value[4] = remaining[0];
    unsortedBottles.value[unsortedBottles.value.indexOf(remaining[0])] = null;
    // IMPORTANTE: Incrementar iteración para que allBottles muestre el último elemento desde sortedBottles
    currentIteration.value = 5; 
  }
  
  isComplete.value = true;
  showMessage('🎉 ¡Ordenamiento completado!', 'success');
  setInstruction('¡Felicidades! Has completado el algoritmo Selection Sort.');
};

const resetAlgorithm = () => {
  initializeBottles();
};

// Initialize on mount
initializeBottles();
</script>

<style scoped>
@keyframes sway {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(2deg); }
  75% { transform: rotate(-2deg); }
}

.animate-sway {
  animation: sway 3s ease-in-out infinite;
}
</style>
