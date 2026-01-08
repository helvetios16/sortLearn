<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { v4 as uuidv4 } from 'uuid';

// --- Core State ---
const numbers = ref<{ id: string; value: number }[]>([]);
const history = ref<string[]>([]);

// Selection state
const selectedNumber = ref<{ id: string; value: number; index: number } | null>(null);
const selectedBox = ref<'min' | null>(null); // Track if min box is selected
const minBox = ref<{ id: string; value: number; originalIndex: number } | null>(null);

// --- Selection Sort Helper State ---
const sortedBoundaryIndex = ref(0);
const isPracticeStarted = ref(false);
const showMinHint = ref(false);
const isHintOnCooldown = ref(false);

// Comparison tracking for enforcing algorithm
const comparedIndices = ref<number[]>([]); // Indices that have been compared
const currentMinIndex = ref<number | null>(null); // Current minimum found during comparison
const allCompared = ref(false); // Whether all elements have been compared

// Drag and drop state
const draggedItem = ref<{
  id: string;
  value: number;
  index: number;
  source: 'array' | 'minBox';
} | null>(null);
const dropTarget = ref<{ index: number; type: 'array' | 'minBox' } | null>(null);

// --- Computed Properties for Hints & Controls ---
const unsortedPart = computed(() => {
  return numbers.value
    .map((n, index) => ({ ...n, index }))
    .filter((n) => n.index >= sortedBoundaryIndex.value);
});

const actualMinInUnsorted = computed(() => {
  if (unsortedPart.value.length === 0) return null;
  return unsortedPart.value.reduce((min, current) => (current.value < min.value ? current : min));
});

const swapTargetIndex = computed(() => {
  if (sortedBoundaryIndex.value >= numbers.value.length) return null;
  return sortedBoundaryIndex.value;
});

const coachHint = computed(() => {
  if (!isPracticeStarted.value) return '🎮 Prepara tu lista y presiona ▶ para empezar';
  if (sortedBoundaryIndex.value >= numbers.value.length) return '🎉 ¡Felicidades! Lista ordenada';

  if (!allCompared.value) {
    const nextIndex = sortedBoundaryIndex.value + comparedIndices.value.length;
    if (nextIndex < numbers.value.length) {
      return `🔍 Compara posición ${nextIndex} → (${comparedIndices.value.length}/${unsortedPart.value.length})`;
    }
  }

  if (!minBox.value) {
    return '👆 Selecciona el mínimo → 📦 Mínimo Encontrado';
  }

  return '📦 Mínimo Encontrado → 🎯 Posición objetivo (fucsia)';
});

// Categorize history messages for enhanced UI
const categorizedHistory = computed(() => {
  return history.value.map((message) => {
    let type: 'comparison' | 'success' | 'error' | 'info' | 'celebration' = 'info';
    let icon = '💬';

    if (message.includes('🔍')) {
      type = 'comparison';
      icon = '🔍';
    } else if (
      message.includes('✅') ||
      message.includes('Correcto') ||
      message.includes('Excelente')
    ) {
      type = 'success';
      icon = '✅';
    } else if (message.includes('❌')) {
      type = 'error';
      icon = '❌';
    } else if (message.includes('🎉')) {
      type = 'celebration';
      icon = '🎉';
    } else if (message.includes('⚠️')) {
      type = 'error';
      icon = '⚠️';
    }

    return { message, type, icon };
  });
});

// --- Watcher for Auto-Advancing & Resetting Hint ---
watch(sortedBoundaryIndex, () => {
  showMinHint.value = false;
  isHintOnCooldown.value = false;
});

// --- User Actions ---
function triggerMinHint() {
  if (isHintOnCooldown.value || showMinHint.value) return;

  showMinHint.value = true;
  isHintOnCooldown.value = true;

  setTimeout(() => {
    showMinHint.value = false;
  }, 5000);

  setTimeout(() => {
    isHintOnCooldown.value = false;
  }, 15000);
}

function addNumber() {
  if (isPracticeStarted.value || numbers.value.length >= 15) return;
  numbers.value.push({ id: uuidv4(), value: Math.floor(Math.random() * 100) });
}

function removeNumber() {
  if (isPracticeStarted.value || numbers.value.length === 0) return;
  numbers.value.pop();
}

function startPractice() {
  isPracticeStarted.value = true;
  history.value.push('¡Práctica iniciada! Encuentra el mínimo y completa los intercambios.');
}

function reset() {
  numbers.value = [];
  history.value = [];
  sortedBoundaryIndex.value = 0;
  isPracticeStarted.value = false;
  showMinHint.value = false;
  isHintOnCooldown.value = false;
  minBox.value = null;
  selectedNumber.value = null;
  selectedBox.value = null;
  comparedIndices.value = [];
  currentMinIndex.value = null;
  allCompared.value = false;
}

function updateNumberValue(index: number, newValue: string) {
  const parsed = parseInt(newValue);
  if (!isNaN(parsed) && parsed >= 0 && parsed <= 999) {
    const num = numbers.value[index];
    if (num) {
      num.value = parsed;
    }
  }
}

// --- Click-based Selection Functions ---
function selectNumberFromArray(num: { id: string; value: number }, index: number) {
  if (!isPracticeStarted.value || index < sortedBoundaryIndex.value) return;

  // Phase 1: Comparing elements sequentially
  if (!allCompared.value) {
    const expectedIndex = sortedBoundaryIndex.value + comparedIndices.value.length;

    if (index !== expectedIndex) {
      history.value.push(
        `❌ Debes comparar los elementos en orden. Haz clic en la posición ${expectedIndex}.`,
      );
      return;
    }

    // Add to compared list
    comparedIndices.value.push(index);

    // Update current minimum
    const currentMinValue =
      currentMinIndex.value !== null ? numbers.value[currentMinIndex.value] : null;
    if (currentMinIndex.value === null || (currentMinValue && num.value < currentMinValue.value)) {
      currentMinIndex.value = index;
      history.value.push(
        `🔍 Comparaste posición ${index} (valor: ${num.value}). Nuevo mínimo encontrado.`,
      );
    } else if (currentMinValue) {
      history.value.push(
        `🔍 Comparaste posición ${index} (valor: ${num.value}). El mínimo sigue siendo ${currentMinValue.value}.`,
      );
    }

    // Check if all elements have been compared
    if (comparedIndices.value.length === unsortedPart.value.length) {
      allCompared.value = true;
      const minValue = currentMinIndex.value !== null ? numbers.value[currentMinIndex.value] : null;
      if (minValue) {
        history.value.push(
          `✅ Has comparado todos los elementos. El mínimo es ${minValue.value} en posición ${currentMinIndex.value}.`,
        );
      }
    }

    return;
  }

  // Phase 2: Selecting the minimum to place in box
  if (!minBox.value) {
    if (index !== currentMinIndex.value) {
      history.value.push(
        `❌ Debes seleccionar el mínimo encontrado (posición ${currentMinIndex.value}).`,
      );
      return;
    }

    selectedNumber.value = { ...num, index };
    history.value.push(`Seleccionaste el mínimo ${num.value}.`);
  }
}

function placeInMinBox() {
  if (!selectedNumber.value || minBox.value) return;

  const selectedIndex = selectedNumber.value.index;

  minBox.value = {
    id: selectedNumber.value.id,
    value: selectedNumber.value.value,
    originalIndex: selectedIndex,
  };

  // Clear the value from the array
  const arrayItem = numbers.value[selectedIndex];
  if (arrayItem) {
    arrayItem.value = -1; // Use -1 to indicate empty slot
  }

  history.value.push(`Colocaste ${selectedNumber.value.value} en "Mínimo Encontrado".`);
  selectedNumber.value = null;
}

// --- Manual Swap Functions ---
function selectMinBox() {
  if (!minBox.value) return;
  selectedBox.value = 'min';
  selectedNumber.value = null;
  history.value.push(
    `Seleccionaste "Mínimo Encontrado" (${minBox.value.value}). Haz clic en una posición del array.`,
  );
}

function placeBoxValueInArray(index: number) {
  if (!selectedBox.value || selectedBox.value !== 'min') return;
  if (index < sortedBoundaryIndex.value) return;
  if (!minBox.value) return;

  const arrayItem = numbers.value[index];
  if (!arrayItem) return;

  // Get the value that was at the target position
  const targetValue = arrayItem.value;

  // Place min value at target position
  arrayItem.value = minBox.value.value;
  history.value.push(`Colocaste ${minBox.value.value} en la posición ${index}.`);

  // Place target value back at min's original position
  const minOriginalIndex = minBox.value.originalIndex;
  const minOriginalItem = numbers.value[minOriginalIndex];
  if (minOriginalItem && targetValue !== -1) {
    minOriginalItem.value = targetValue;
    history.value.push(`El valor ${targetValue} se movió a la posición ${minOriginalIndex}.`);
  }

  minBox.value = null;
  selectedBox.value = null;

  // Check if swap was correct
  checkSwapCompletion();
}

function checkSwapCompletion() {
  setTimeout(() => {
    const currentPosition = numbers.value[sortedBoundaryIndex.value];
    const actualMin = actualMinInUnsorted.value;

    if (currentPosition && actualMin && currentPosition.value <= actualMin.value) {
      history.value.push(`✅ ¡Excelente! El mínimo está en la posición correcta.`);
      sortedBoundaryIndex.value++;

      // Reset comparison tracking for next iteration
      comparedIndices.value = [];
      currentMinIndex.value = null;
      allCompared.value = false;

      if (sortedBoundaryIndex.value >= numbers.value.length) {
        history.value.push('🎉 ¡Felicidades! Has ordenado toda la lista correctamente.');
      }
    } else {
      history.value.push(`⚠️ El intercambio no colocó el mínimo en la posición correcta.`);
      // Reset to try again
      comparedIndices.value = [];
      currentMinIndex.value = null;
      allCompared.value = false;
    }
  }, 300);
}

// --- Drag and Drop Functions ---
function handleDragStart(
  event: DragEvent,
  num: { id: string; value: number },
  index: number,
  source: 'array' | 'minBox',
) {
  if (!isPracticeStarted.value) return;
  if (source === 'array' && index < sortedBoundaryIndex.value) return;

  draggedItem.value = { id: num.id, value: num.value, index, source };
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', num.id);
  }
}

function handleDragOver(event: DragEvent, index: number, type: 'array' | 'minBox') {
  if (!draggedItem.value) return;

  // Always prevent default to allow drop
  event.preventDefault();
  event.stopPropagation();

  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'move';
  }
  dropTarget.value = { index, type };
}

function handleDragLeave() {
  dropTarget.value = null;
}

function handleDrop(event: DragEvent, targetIndex: number, targetType: 'array' | 'minBox') {
  event.preventDefault();
  if (!draggedItem.value) return;

  const source = draggedItem.value.source;
  const sourceIndex = draggedItem.value.index;

  // Case 1: Dragging from array to minBox (selecting minimum)
  if (source === 'array' && targetType === 'minBox') {
    if (!allCompared.value) {
      history.value.push('❌ Debes comparar todos los elementos antes de seleccionar el mínimo.');
      draggedItem.value = null;
      dropTarget.value = null;
      return;
    }

    if (sourceIndex !== currentMinIndex.value) {
      history.value.push(
        `❌ Debes seleccionar el mínimo encontrado (posición ${currentMinIndex.value}).`,
      );
      draggedItem.value = null;
      dropTarget.value = null;
      return;
    }

    // Place in minBox
    minBox.value = {
      id: draggedItem.value.id,
      value: draggedItem.value.value,
      originalIndex: sourceIndex,
    };

    const arrayItem = numbers.value[sourceIndex];
    if (arrayItem) {
      arrayItem.value = -1;
    }

    history.value.push(`Arrastraste ${draggedItem.value.value} a "Mínimo Encontrado".`);
  }
  // Case 2: Dragging from minBox to array (swapping)
  else if (source === 'minBox' && targetType === 'array') {
    if (targetIndex < sortedBoundaryIndex.value) {
      history.value.push('❌ No puedes colocar el mínimo en una posición ya ordenada.');
      draggedItem.value = null;
      dropTarget.value = null;
      return;
    }

    if (!minBox.value) return;

    const arrayItem = numbers.value[targetIndex];
    if (!arrayItem) return;

    const targetValue = arrayItem.value;
    arrayItem.value = minBox.value.value;
    history.value.push(`Colocaste ${minBox.value.value} en la posición ${targetIndex}.`);

    const minOriginalIndex = minBox.value.originalIndex;
    const minOriginalItem = numbers.value[minOriginalIndex];
    if (minOriginalItem && targetValue !== -1) {
      minOriginalItem.value = targetValue;
      history.value.push(`El valor ${targetValue} se movió a la posición ${minOriginalIndex}.`);
    }

    minBox.value = null;
    checkSwapCompletion();
  }

  draggedItem.value = null;
  dropTarget.value = null;
}

function handleDragEnd() {
  draggedItem.value = null;
  dropTarget.value = null;
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 text-gray-800">
    <div class="container mx-auto p-4 md:p-8">
      <h1
        class="text-3xl md:text-4xl font-extrabold mb-2 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-500"
      >
        Práctica de Selection Sort
      </h1>
      <p class="text-center text-slate-600 mb-8 font-medium max-w-2xl mx-auto text-sm">
        Configura tu lista → Presiona <span class="font-bold text-purple-600">EMPEZAR</span> → Sigue
        las casillas pulsantes
      </p>

      <!-- Panel de Control -->
      <div class="bg-white border border-gray-200 rounded-xl shadow-md p-4 mb-8 max-w-4xl mx-auto">
        <div class="flex flex-wrap justify-center items-center gap-4">
          <template v-if="!isPracticeStarted">
            <button
              @click="addNumber"
              class="px-4 py-2 flex items-center justify-center rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 font-bold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed gap-2"
              title="Añadir un número aleatorio a la lista"
              :disabled="numbers.length >= 15"
            >
              <span class="text-lg">+</span>
              <span>Añadir Número</span>
            </button>
            <button
              @click="removeNumber"
              class="px-4 py-2 flex items-center justify-center rounded-lg bg-red-100 text-red-700 hover:bg-red-200 font-bold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed gap-2"
              title="Quitar el último número de la lista"
              :disabled="numbers.length === 0"
            >
              <span class="text-lg">−</span>
              <span>Quitar Número</span>
            </button>

            <div class="w-px h-8 bg-gray-300 mx-2"></div>

            <button
              @click="startPractice"
              class="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-lg shadow hover:shadow-lg hover:scale-105 transform transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              title="Empezar a Practicar"
              :disabled="numbers.length === 0"
            >
              <span>▶</span> EMPEZAR
            </button>
          </template>

          <button
            @click="reset"
            class="px-4 py-2 bg-slate-200 text-slate-700 font-bold rounded-lg hover:bg-slate-300 transition-colors flex items-center gap-2"
            title="Reiniciar"
          >
            <span>↻</span> REINICIAR
          </button>

          <template v-if="isPracticeStarted && sortedBoundaryIndex < numbers.length">
            <div class="w-px h-8 bg-gray-300 mx-2"></div>
            <button
              @click="triggerMinHint"
              class="w-12 h-12 flex items-center justify-center rounded-full bg-yellow-100 text-yellow-600 hover:bg-yellow-200 font-bold text-xl transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              title="Mostrar Pista del Mínimo"
              :disabled="isHintOnCooldown || showMinHint || !allCompared"
            >
              💡
            </button>
          </template>
        </div>
      </div>

      <!-- Hint Banner -->
      <div
        class="max-w-4xl mx-auto mb-8 p-4 rounded-xl border-l-8 text-center shadow-sm transition-all duration-300"
        :class="[
          coachHint.includes('❌')
            ? 'bg-red-50 border-red-500 text-red-800'
            : coachHint.includes('🎉')
              ? 'bg-green-50 border-green-500 text-green-800'
              : 'bg-blue-50 border-blue-500 text-blue-800',
        ]"
      >
        <p class="text-lg font-bold flex items-center justify-center gap-2">
          {{ coachHint }}
        </p>
      </div>

      <div class="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto items-start">
        <!-- Área Principal: Array y Mínimo -->
        <div class="flex-1 w-full flex flex-col gap-8">
          <!-- Hint para editar valores -->
          <p
            v-if="!isPracticeStarted && numbers.length > 0"
            class="text-center text-sm text-slate-600 -mb-6"
          >
            ✏️ Clic en los números para editarlos
          </p>

          <!-- Array Visual -->
          <div
            class="bg-slate-100 border-2 border-slate-200 rounded-2xl p-6 shadow-inner min-h-[200px] flex items-center justify-center"
          >
            <div class="flex flex-wrap justify-center gap-3">
              <div
                v-for="(num, index) in numbers"
                :key="num.id"
                class="relative group"
                @click="
                  isPracticeStarted
                    ? selectedBox
                      ? placeBoxValueInArray(index)
                      : selectNumberFromArray(num, index)
                    : null
                "
              >
                <!-- Index Label -->
                <div
                  class="absolute -top-6 left-0 w-full text-center text-xs font-mono font-bold text-slate-400"
                >
                  {{ index }}
                </div>

                <!-- Number Box -->
                <div
                  :draggable="isPracticeStarted && index >= sortedBoundaryIndex && num.value !== -1"
                  class="w-14 h-16 md:w-16 md:h-20 flex items-center justify-center rounded-xl border-b-4 text-xl md:text-2xl font-bold transition-all duration-200 cursor-pointer shadow-sm relative bg-white"
                  :class="[
                    // Estado Ordenado
                    index < sortedBoundaryIndex
                      ? 'bg-emerald-100 border-emerald-500 text-emerald-700'
                      : 'border-slate-300 text-slate-700 hover:-translate-y-1',

                    // Estados de Interacción
                    selectedNumber?.id === num.id && num.value !== -1
                      ? 'ring-4 ring-purple-400 border-purple-600 scale-110 z-10'
                      : '',
                    index === swapTargetIndex && minBox
                      ? 'animate-pulse-strong ring-4 ring-pink-400 border-pink-500'
                      : '',

                    // Pistas y Comparaciones
                    num.id === actualMinInUnsorted?.id && showMinHint
                      ? 'ring-4 ring-yellow-300 border-yellow-400'
                      : '',
                    comparedIndices.includes(index)
                      ? 'bg-blue-50 border-blue-300 text-blue-900'
                      : '',
                    index === currentMinIndex && !allCompared
                      ? 'bg-yellow-50 border-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.3)]'
                      : '',

                    // GUÍA VISUAL: Próximo número a comparar (PULSA)
                    isPracticeStarted &&
                    !selectedNumber &&
                    !allCompared &&
                    index === sortedBoundaryIndex + comparedIndices.length &&
                    index >= sortedBoundaryIndex
                      ? 'animate-pulse-strong ring-4 ring-blue-400'
                      : '',

                    // Vacío
                    num.value === -1
                      ? 'bg-slate-100 border-dashed border-slate-300 text-transparent'
                      : '',

                    // Editable
                    !isPracticeStarted ? 'hover:border-purple-300' : '',

                    // Drag and Drop states
                    isPracticeStarted && index >= sortedBoundaryIndex && num.value !== -1
                      ? 'cursor-grab'
                      : '',
                    draggedItem?.id === num.id ? 'opacity-50 cursor-grabbing' : '',
                    dropTarget?.type === 'array' && dropTarget?.index === index
                      ? 'ring-4 ring-blue-500 bg-blue-50'
                      : '',
                  ]"
                  @dragstart="handleDragStart($event, num, index, 'array')"
                  @dragover="handleDragOver($event, index, 'array')"
                  @dragleave="handleDragLeave()"
                  @drop="handleDrop($event, index, 'array')"
                  @dragend="handleDragEnd()"
                >
                  <input
                    v-if="!isPracticeStarted"
                    type="number"
                    class="w-full h-full bg-transparent text-center outline-none"
                    :value="num.value"
                    @input="updateNumberValue(index, ($event.target as HTMLInputElement).value)"
                    @click.stop
                    min="0"
                    max="999"
                  />
                  <span v-else-if="num.value !== -1">{{ num.value }}</span>

                  <!-- Badges/Etiquetas -->
                  <div
                    v-if="index < sortedBoundaryIndex"
                    class="absolute -bottom-2 right-1 text-[10px] bg-emerald-500 text-white px-1 rounded"
                  >
                    OK
                  </div>
                  <div
                    v-if="index === currentMinIndex && !allCompared"
                    class="absolute -top-2 -right-2 text-[10px] bg-yellow-400 text-yellow-900 px-1.5 py-0.5 rounded-full font-bold shadow-sm z-20"
                  >
                    min?
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Área de Variable Temporal (Mínimo Encontrado) -->
          <div class="flex justify-center">
            <div
              class="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-4 shadow-lg flex flex-col items-center gap-2 min-w-[200px]"
            >
              <h3 class="text-sm font-bold text-yellow-800 uppercase tracking-wide">
                Mínimo Encontrado
              </h3>

              <div
                :draggable="minBox !== null"
                class="w-20 h-20 flex items-center justify-center rounded-xl border-b-4 text-3xl font-bold transition-all cursor-pointer bg-white"
                :class="[
                  minBox
                    ? 'border-yellow-500 text-yellow-900 shadow-md scale-105'
                    : 'border-dashed border-yellow-300 text-yellow-200',
                  selectedBox === 'min' ? 'ring-4 ring-purple-400 border-purple-500' : '',
                  // GUÍA VISUAL: Pulsa cuando hay número seleccionado y no hay mínimo
                  selectedNumber !== null && !minBox && allCompared
                    ? 'animate-pulse-strong ring-4 ring-yellow-400'
                    : '',
                  // GUÍA VISUAL: Pulsa cuando minBox está lleno y listo para intercambiar
                  minBox && !selectedBox ? 'animate-pulse-strong ring-4 ring-yellow-400' : '',
                  // Drag and Drop states
                  minBox ? 'cursor-grab' : '',
                  draggedItem?.source === 'minBox' ? 'opacity-50 cursor-grabbing' : '',
                  dropTarget?.type === 'minBox' ? 'ring-4 ring-blue-500 bg-blue-50' : '',
                ]"
                @click="minBox ? selectMinBox() : placeInMinBox()"
                @dragstart="
                  minBox ? handleDragStart($event, minBox, minBox.originalIndex, 'minBox') : null
                "
                @dragover="handleDragOver($event, -1, 'minBox')"
                @dragleave="handleDragLeave()"
                @drop="handleDrop($event, -1, 'minBox')"
                @dragend="handleDragEnd()"
              >
                <span v-if="minBox">{{ minBox.value }}</span>
                <span
                  v-else
                  class="text-4xl text-yellow-200 select-none"
                  >?</span
                >
              </div>

              <p class="text-xs text-yellow-700 font-bold text-center">
                {{ minBox ? '📦 Mínimo' : '?' }}
              </p>
            </div>
          </div>
        </div>

        <!-- Panel Lateral: Historial -->
        <div
          class="w-full lg:w-80 flex-shrink-0"
          v-if="history.length > 0"
        >
          <div
            class="bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden sticky top-4"
          >
            <div class="bg-slate-50 p-3 border-b border-gray-200 flex justify-between items-center">
              <h2 class="font-bold text-slate-700 flex items-center gap-2">
                <span>📜</span> Historial
              </h2>
              <span class="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded-full">
                {{ history.length }} pasos
              </span>
            </div>

            <div class="max-h-[500px] overflow-y-auto p-3 space-y-2 custom-scrollbar">
              <div
                v-for="(item, index) in categorizedHistory.slice().reverse()"
                :key="index"
                class="p-2.5 rounded-lg text-sm border-l-4 shadow-sm animate-fade-in"
                :class="[
                  item.type === 'error'
                    ? 'bg-red-50 border-red-400 text-red-900'
                    : item.type === 'success'
                      ? 'bg-emerald-50 border-emerald-400 text-emerald-900'
                      : item.type === 'celebration'
                        ? 'bg-amber-50 border-amber-400 text-amber-900'
                        : item.type === 'comparison'
                          ? 'bg-blue-50 border-blue-400 text-blue-900'
                          : 'bg-gray-50 border-gray-300 text-gray-700',
                ]"
              >
                <div class="flex gap-2">
                  <span class="text-base select-none">{{ item.icon }}</span>
                  <span class="leading-snug">{{ item.message.replace(item.icon, '').trim() }}</span>
                </div>
                <div class="text-[10px] text-right opacity-50 mt-1 font-mono">
                  Paso {{ history.length - index }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Custom Scrollbar for History */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f5f9;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fade-in {
  animation: fadeIn 0.3s ease-out forwards;
}

/* Animación de pulso fuerte para guía visual */
@keyframes pulseStrong {
  0%,
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 0 0 10px rgba(59, 130, 246, 0);
  }
}
.animate-pulse-strong {
  animation: pulseStrong 1.5s ease-in-out infinite;
}

/* Animación de pulso para ring */
@keyframes pulseRing {
  0%,
  100% {
    box-shadow: 0 0 0 0 rgba(236, 72, 153, 0.7);
  }
  50% {
    box-shadow: 0 0 0 8px rgba(236, 72, 153, 0);
  }
}
.animate-pulse-ring {
  animation: pulseRing 1.5s ease-in-out infinite;
}

/* Hide number input arrows */
input[type='number']::-webkit-inner-spin-button,
input[type='number']::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type='number'] {
  -moz-appearance: textfield;
  appearance: textfield;
}
</style>
