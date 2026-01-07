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
</script>

<template>
  <div class="page-container">
    <div class="container">
      <h1 class="title">Practicando Selection Sort</h1>
      <p class="subtitle">
        Haz clic en los números y las casillas para practicar el algoritmo de ordenamiento.
      </p>

      <div class="controls-container">
        <button
          v-if="!isPracticeStarted"
          @click="addNumber"
          class="btn btn-icon btn-primary"
          title="Añadir Número"
          :disabled="numbers.length >= 15"
        >
          +
        </button>
        <button
          v-if="!isPracticeStarted"
          @click="removeNumber"
          class="btn btn-icon btn-secondary"
          title="Quitar Número"
          :disabled="numbers.length === 0"
        >
          -
        </button>

        <div
          v-if="!isPracticeStarted"
          class="separator"
        ></div>

        <button
          v-if="!isPracticeStarted"
          @click="startPractice"
          class="btn btn-icon btn-accent"
          title="Empezar a Practicar"
          :disabled="numbers.length === 0"
        >
          ▶
        </button>
        <button
          @click="reset"
          class="btn btn-icon btn-secondary"
          title="Reiniciar"
        >
          ↻
        </button>

        <div
          v-if="isPracticeStarted && sortedBoundaryIndex < numbers.length"
          class="separator"
        ></div>

        <button
          v-if="isPracticeStarted && sortedBoundaryIndex < numbers.length"
          @click="triggerMinHint"
          class="btn btn-icon btn-hint"
          title="Mostrar Pista del Mínimo"
          :disabled="isHintOnCooldown || showMinHint || !allCompared"
        >
          💡
        </button>
      </div>

      <div class="coach-hint">
        <p>{{ coachHint }}</p>
      </div>

      <div class="main-area">
        <div class="numbers-container">
          <div
            v-for="(num, index) in numbers"
            :key="num.id"
            class="number-wrapper"
            @click="
              isPracticeStarted
                ? selectedBox
                  ? placeBoxValueInArray(index)
                  : selectNumberFromArray(num, index)
                : null
            "
            :class="{
              sorted: index < sortedBoundaryIndex,
              selected: selectedNumber?.id === num.id,
              'is-swap-target': index === swapTargetIndex,
              'is-actual-min': num.id === actualMinInUnsorted?.id && showMinHint,
              editable: !isPracticeStarted,
              empty: num.value === -1,
              compared: comparedIndices.includes(index),
              'current-min': index === currentMinIndex && !allCompared,
            }"
          >
            <input
              v-if="!isPracticeStarted"
              type="number"
              class="number-input"
              :value="num.value"
              @input="updateNumberValue(index, ($event.target as HTMLInputElement).value)"
              @click.stop
              min="0"
              max="999"
            />
            <span
              v-else-if="num.value !== -1"
              class="number-value"
              >{{ num.value }}</span
            >
          </div>
        </div>

        <div class="temp-area">
          <div class="min-found-area">
            <div class="temp-label label-min-found">Mínimo Encontrado</div>
            <div
              class="min-found-box number-wrapper"
              :class="{
                'has-value': minBox !== null,
                'pulse-subtle': selectedNumber !== null && !minBox,
              }"
              @click="minBox ? selectMinBox() : placeInMinBox()"
            >
              <span
                v-if="minBox"
                class="number-value"
                >{{ minBox.value }}</span
              >
            </div>
          </div>
        </div>
      </div>

      <div
        class="history-container"
        v-if="history.length > 0"
      >
        <div class="history-header">
          <h2 class="history-title">📜 Historial de Pasos</h2>
          <span class="history-count"
            >{{ history.length }} {{ history.length === 1 ? 'paso' : 'pasos' }}</span
          >
        </div>
        <div class="history-list">
          <div
            v-for="(item, index) in categorizedHistory"
            :key="index"
            class="history-item"
            :class="`history-${item.type}`"
          >
            <span class="history-icon">{{ item.icon }}</span>
            <span class="history-message">{{ item.message.replace(item.icon, '').trim() }}</span>
            <span class="history-index">#{{ index + 1 }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');
.page-container {
  --fuchsia: #ff00ff;
  --purple: #8a2be2;
  --pink: #ffc0cb;
  --bg-dark: #1a1a1a;
  --bg-light: #2a2a2a;
  --text-color: #f0f0f0;
  --sorted-color: #03dac6;
  --min-hint-color: #f0e68c;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 100vh;
  background-color: var(--bg-dark);
  font-family: 'Poppins', sans-serif;
  color: var(--text-color);
  padding: 2rem;
}
.container {
  width: 100%;
  max-width: 1050px;
  text-align: center;
}
.title {
  font-size: 2.5rem;
  font-weight: 600;
  color: var(--fuchsia);
  margin-bottom: 0.5rem;
  text-shadow: 0 0 10px var(--fuchsia);
}
.subtitle {
  font-size: 1.1rem;
  color: var(--pink);
  margin-bottom: 1rem;
}
.controls-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  min-height: 60px;
  background-color: rgba(42, 42, 42, 0.5);
  padding: 1rem;
  border-radius: 12px;
}
.separator {
  width: 2px;
  height: 24px;
  background-color: var(--purple);
  margin: 0 0.5rem;
}
.coach-hint {
  min-height: 2.5em;
  font-size: 1.1rem;
  color: var(--pink);
  margin-bottom: 1rem;
  font-style: italic;
}
.main-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  margin-bottom: 1rem;
}
.numbers-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.75rem;
  min-height: 180px;
  max-width: 980px;
}

.temp-area {
  display: flex;
  gap: 2rem;
  align-items: flex-start;
}
.min-found-area,
.temp-var-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}
.separator-vertical {
  width: 2px;
  height: 80px;
  background-color: var(--purple);
  align-self: center;
  margin-top: 1.5rem;
}

.temp-label {
  font-size: 1rem;
  font-weight: 600;
  color: var(--fuchsia);
}

.label-min-found {
  color: var(--min-hint-color);
}

.history-container {
  width: 100%;
  max-width: 850px;
  margin: 2rem auto 1rem;
  background: linear-gradient(135deg, rgba(42, 42, 42, 0.95), rgba(30, 30, 30, 0.95));
  backdrop-filter: blur(10px);
  padding: 0;
  border-radius: 16px;
  border: 1px solid rgba(138, 43, 226, 0.3);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  overflow: hidden;
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
  background: linear-gradient(90deg, rgba(138, 43, 226, 0.15), rgba(255, 0, 255, 0.1));
  border-bottom: 1px solid rgba(138, 43, 226, 0.2);
}

.history-title {
  font-size: 1.4rem;
  color: var(--fuchsia);
  margin: 0;
  font-weight: 600;
  text-shadow: 0 0 10px rgba(255, 0, 255, 0.3);
}

.history-count {
  font-size: 0.9rem;
  color: var(--pink);
  background: rgba(255, 192, 203, 0.1);
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  border: 1px solid rgba(255, 192, 203, 0.3);
  font-weight: 500;
}

.history-list {
  padding: 1rem;
  margin: 0;
  max-height: 350px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.history-list::-webkit-scrollbar {
  width: 8px;
}

.history-list::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 10px;
}

.history-list::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, var(--fuchsia), var(--purple));
  border-radius: 10px;
}

.history-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.85rem 1rem;
  border-radius: 10px;
  transition: all 0.3s ease;
  animation: slideIn 0.4s ease-out;
  position: relative;
  overflow: hidden;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.history-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 3px;
  transition: width 0.3s ease;
}

.history-item:hover {
  transform: translateX(5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.history-item:hover::before {
  width: 5px;
}

.history-icon {
  font-size: 1.3rem;
  flex-shrink: 0;
  filter: drop-shadow(0 0 4px currentColor);
}

.history-message {
  flex: 1;
  font-size: 0.95rem;
  line-height: 1.4;
  color: #e0e0e0;
}

.history-index {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.4);
  font-weight: 600;
  min-width: 35px;
  text-align: right;
}

/* Message type styles */
.history-comparison {
  background: rgba(74, 158, 255, 0.08);
  border-left: 3px solid #4a9eff;
}

.history-comparison::before {
  background: #4a9eff;
}

.history-comparison:hover {
  background: rgba(74, 158, 255, 0.15);
}

.history-success {
  background: rgba(3, 218, 198, 0.08);
  border-left: 3px solid #03dac6;
}

.history-success::before {
  background: #03dac6;
}

.history-success:hover {
  background: rgba(3, 218, 198, 0.15);
}

.history-error {
  background: rgba(255, 82, 82, 0.08);
  border-left: 3px solid #ff5252;
}

.history-error::before {
  background: #ff5252;
}

.history-error:hover {
  background: rgba(255, 82, 82, 0.15);
}

.history-info {
  background: rgba(138, 43, 226, 0.08);
  border-left: 3px solid var(--purple);
}

.history-info::before {
  background: var(--purple);
}

.history-info:hover {
  background: rgba(138, 43, 226, 0.15);
}

.history-celebration {
  background: linear-gradient(90deg, rgba(255, 215, 0, 0.1), rgba(255, 0, 255, 0.1));
  border-left: 3px solid gold;
  animation: celebration-pulse 2s ease-in-out infinite;
}

.history-celebration::before {
  background: linear-gradient(180deg, gold, var(--fuchsia));
}

@keyframes celebration-pulse {
  0%,
  100% {
    box-shadow: 0 0 10px rgba(255, 215, 0, 0.3);
  }
  50% {
    box-shadow: 0 0 20px rgba(255, 215, 0, 0.6);
  }
}

.btn {
  padding: 0.8rem 1.5rem;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  color: white;
  border-radius: 8px;
}
.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.btn-primary {
  background-color: var(--fuchsia);
}
.btn-secondary {
  background-color: var(--purple);
}
.btn-accent {
  background: linear-gradient(45deg, var(--fuchsia), var(--purple));
}
.btn-hint {
  background-color: var(--min-hint-color);
  color: #1a1a1a;
}

.btn-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  font-size: 1.5rem;
  line-height: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
}
.btn-icon[title='Añadir Número'],
.btn-icon[title='Quitar Número'] {
  font-size: 2rem;
  font-weight: bold;
}

.number-wrapper {
  width: 60px;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--bg-light);
  border: 2px solid var(--purple);
  border-radius: 10px;
  transition: all 0.3s ease;
  position: relative;
  cursor: pointer;
}

.number-value {
  font-size: 1.4rem;
  font-weight: 600;
  user-select: none;
}

.number-wrapper.sorted {
  border-color: var(--sorted-color);
  opacity: 0.6;
  cursor: default;
}

.number-wrapper.selected {
  transform: scale(1.1);
  box-shadow: 0 0 20px white;
  border-color: white;
}

.number-wrapper.empty {
  background-color: #1e1e1e;
  border-style: dashed;
  border-color: #444;
  opacity: 0.5;
  cursor: default;
}

.number-wrapper.compared {
  border-color: #4a9eff;
  background-color: rgba(74, 158, 255, 0.1);
}

.number-wrapper.current-min {
  border-color: var(--min-hint-color);
  background-color: rgba(240, 230, 140, 0.15);
  box-shadow: 0 0 15px rgba(240, 230, 140, 0.3);
}

.min-found-box {
  border-style: dashed;
  border-color: var(--min-hint-color);
}

/* Yellow pulse animation - stays yellow */
@keyframes yellow-pulse {
  0%,
  100% {
    border-color: var(--min-hint-color);
    box-shadow:
      0 0 20px var(--min-hint-color),
      0 0 40px var(--min-hint-color);
  }
  50% {
    border-color: #ffff00;
    box-shadow:
      0 0 40px #ffff00,
      0 0 80px #ffff00;
  }
}

.min-found-box.has-value {
  border-style: solid;
  border-color: var(--min-hint-color);
  animation: yellow-pulse 2s ease-in-out infinite;
}

/* Subtle pulse animation for any selection */
@keyframes pulse-subtle {
  0%,
  100% {
    box-shadow: 0 0 10px var(--min-hint-color);
    border-color: var(--min-hint-color);
  }
  50% {
    box-shadow: 0 0 20px var(--min-hint-color);
    border-color: #fff8a0;
  }
}

.pulse-subtle {
  animation: pulse-subtle 1.5s ease-in-out infinite;
}

.number-wrapper.is-swap-target:not(.sorted) {
  box-shadow: 0 0 20px var(--fuchsia);
  border-color: var(--fuchsia);
}

.number-wrapper.is-actual-min:not(.sorted) {
  border-color: var(--min-hint-color);
}

.number-wrapper.is-actual-min:not(.sorted)::after {
  content: 'Mín';
  position: absolute;
  top: -10px;
  right: -10px;
  background: var(--min-hint-color);
  color: black;
  font-size: 0.7rem;
  font-weight: bold;
  padding: 2px 4px;
  border-radius: 4px;
}

.number-input {
  width: 70px;
  height: 40px;
  background: transparent;
  border: none;
  color: var(--text-color);
  font-size: 1.8rem;
  font-weight: 600;
  text-align: center;
  font-family: 'Poppins', sans-serif;
  outline: none;
}

.number-input:focus {
  color: var(--fuchsia);
}

.number-wrapper.editable {
  cursor: text;
  border-color: var(--purple);
}

.number-wrapper.editable:hover {
  border-color: var(--fuchsia);
  box-shadow: 0 0 10px rgba(255, 0, 255, 0.3);
}

/* Hide number input arrows */
.number-input::-webkit-inner-spin-button,
.number-input::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.number-input[type='number'] {
  -moz-appearance: textfield;
}
</style>
