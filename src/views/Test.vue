<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { v4 as uuidv4 } from 'uuid';

// --- Core State ---
const numbers = ref<{ id: string; value: number }[]>([]);
const selectedId = ref<string | null>(null);
const confirmedMinId = ref<string | null>(null); // New state for the confirmed minimum
const history = ref<string[]>([]);
const isAnimating = ref(false);
const showMinHint = ref(false);
const isHintOnCooldown = ref(false); // New state for hint cooldown

// Visual state for the animation
const animatedState = ref<{
  numbers: { id: string; value: number | null }[],
  temp: number | null,
}>({ numbers: [], temp: null });


// --- Selection Sort Helper State ---
const sortedBoundaryIndex = ref(0);
const isPracticeStarted = ref(false);

// --- Computed Properties for Hints & Controls ---
const unsortedPart = computed(() => {
  return numbers.value.filter((n, index) => index >= sortedBoundaryIndex.value);
});

const actualMinInUnsorted = computed(() => {
  if (unsortedPart.value.length === 0) return null;
  return unsortedPart.value.reduce((min, current) => current.value < min.value ? current : min);
});

const swapTargetId = computed(() => {
  if (sortedBoundaryIndex.value >= numbers.value.length) return null;
  return numbers.value[sortedBoundaryIndex.value].id;
});

const coachHint = computed(() => {
  if (isAnimating.value) return "Observa cómo funciona el intercambio...";
  if (!isPracticeStarted.value) return "Prepara tu lista y haz clic en 'Empezar a Practicar'.";
  if (sortedBoundaryIndex.value >= numbers.value.length) return "¡Felicidades! Has ordenado la lista.";
  
  if (confirmedMinId.value) {
    return "¡Correcto! Ahora selecciona el primer elemento no ordenado (resaltado en fucsia) para intercambiarlo.";
  }
  if (selectedId.value) {
    return "Haz clic en la casilla 'Mínimo Encontrado' para confirmar tu selección.";
  }
  return `Paso ${sortedBoundaryIndex.value + 1}: Haz clic en el número más pequeño de la sección no ordenada.`;
});

const displayNumbers = computed(() => {
  return isAnimating.value ? animatedState.value.numbers : numbers.value;
});

// --- Watcher for Auto-Advancing & Resetting Hint ---
watch(sortedBoundaryIndex, () => {
  showMinHint.value = false; // Reset hint visibility
  isHintOnCooldown.value = false; // Reset hint cooldown
});

// --- User Actions ---
function triggerMinHint() {
  if (isHintOnCooldown.value || showMinHint.value) return;

  showMinHint.value = true;
  isHintOnCooldown.value = true;

  setTimeout(() => {
    showMinHint.value = false;
  }, 5000); // Hint is visible for 5 seconds

  setTimeout(() => {
    isHintOnCooldown.value = false;
  }, 15000); // Cooldown is 15 seconds
}

function addNumber() {
  if (isPracticeStarted.value || numbers.value.length >= 10) return;
  numbers.value.push({ id: uuidv4(), value: Math.floor(Math.random() * 100) });
}

function removeNumber() {
  if (isPracticeStarted.value || numbers.value.length === 0) return;
  numbers.value.pop();
}

function startPractice() {
  isPracticeStarted.value = true;
  history.value.push("¡Práctica iniciada! Ordena la lista usando Selection Sort.");
}

function reset() {
  numbers.value = [];
  history.value = [];
  selectedId.value = null;
  confirmedMinId.value = null;
  sortedBoundaryIndex.value = 0;
  isPracticeStarted.value = false;
  isAnimating.value = false;
  animatedState.value = { numbers: [], temp: null };
}

function selectItem(id: string) {
  if (isAnimating.value || !isPracticeStarted.value) return;

  // If a minimum has been confirmed, we are now selecting the swap target
  if (confirmedMinId.value) {
    // We only allow swapping with the official swap target
    if (id === swapTargetId.value) {
      performAnimatedSwap(confirmedMinId.value, id);
    } else {
      history.value.push("Debes intercambiar el mínimo con el primer elemento de la sección no ordenada.");
    }
    return;
  }

  // Otherwise, we are selecting a candidate for the minimum
  if (selectedId.value === id) {
    selectedId.value = null; // deselect
  } else {
    selectedId.value = id;
  }
}

function confirmMinimumSelection() {
  if (!selectedId.value || confirmedMinId.value || !isPracticeStarted.value) return;

  if (selectedId.value === actualMinInUnsorted.value?.id) {
    confirmedMinId.value = selectedId.value;
    selectedId.value = null; // Clear selection to prepare for next selection
    history.value.push(`¡Correcto! ${actualMinInUnsorted.value.value} es el mínimo. Ahora selecciona con qué intercambiarlo.`);
  } else {
    history.value.push("Ese no es el valor mínimo. Inténtalo de nuevo.");
    selectedId.value = null;
  }
}

function performAnimatedSwap(idA: string, idB: string) {
  if (isAnimating.value) return;

  isAnimating.value = true;

  const indexA = numbers.value.findIndex(n => n.id === idA);
  const indexB = numbers.value.findIndex(n => n.id === idB);
  const valA = numbers.value[indexA].value;
  const valB = numbers.value[indexB].value;
  
  animatedState.value.numbers = JSON.parse(JSON.stringify(numbers.value));
  animatedState.value.temp = null;

  setTimeout(() => {
    animatedState.value.temp = valA;
    animatedState.value.numbers[indexA].value = null;
    history.value.push(`1. Guardando el mínimo (${valA}) en la temporal.`);
  }, 500);

  setTimeout(() => {
    animatedState.value.numbers[indexA].value = valB;
    animatedState.value.numbers[indexB].value = null;
    history.value.push(`2. Moviendo ${valB} a la posición del mínimo.`);
  }, 1500);

  setTimeout(() => {
    animatedState.value.numbers[indexB].value = valA;
    animatedState.value.temp = null;
    history.value.push(`3. Moviendo el mínimo (${valA}) a su posición final.`);
  }, 2500);

  setTimeout(() => {
    [numbers.value[indexA].value, numbers.value[indexB].value] = [valB, valA];
    
    history.value.push(`¡Intercambio completado! El ${valA} está ahora en su lugar.`);
    sortedBoundaryIndex.value++;

    selectedId.value = null;
    confirmedMinId.value = null;
    isAnimating.value = false;
  }, 3500);
}

</script>

<template>
  <div class="page-container">
    <div class="container">
      <h1 class="title">Practicando Selection Sort</h1>
      <p class="subtitle">Encuentra el mínimo, confírmalo, y luego intercámbialo.</p>
      
      <div class="controls-container">
        <button v-if="!isPracticeStarted" @click="addNumber" class="btn btn-icon btn-primary" title="Añadir Número" :disabled="numbers.length >= 10">+</button>
        <button v-if="!isPracticeStarted" @click="removeNumber" class="btn btn-icon btn-secondary" title="Quitar Número" :disabled="numbers.length === 0">-</button>
        
        <div v-if="!isPracticeStarted && numbers.length > 0" class="separator"></div>

        <button v-if="!isPracticeStarted && numbers.length > 0" @click="startPractice" class="btn btn-icon btn-accent" title="Empezar a Practicar">▶</button>
        <button @click="reset" class="btn btn-icon btn-secondary" title="Reiniciar">↻</button>
        
        <div v-if="isPracticeStarted && sortedBoundaryIndex < numbers.length" class="separator"></div>
        
        <button v-if="isPracticeStarted && sortedBoundaryIndex < numbers.length" @click="triggerMinHint" class="btn btn-icon btn-hint" title="Mostrar Pista del Mínimo" :disabled="isHintOnCooldown || showMinHint">💡</button>
      </div>

      <div class="coach-hint">
        <p>{{ coachHint }}</p>
      </div>

      <div class="main-area">
        <div class="numbers-container">
          <div
            v-for="(num, index) in displayNumbers"
            :key="num.id"
            class="number-wrapper"
            @click="selectItem(num.id)"
            :class="{ 
              'sorted': !isAnimating && index < sortedBoundaryIndex,
              'selected': num.id === selectedId || num.id === confirmedMinId,
              'empty': num.value === null,
              'is-swap-target': !isAnimating && num.id === swapTargetId,
              'is-actual-min': !isAnimating && num.id === actualMinInUnsorted?.id && showMinHint
            }"
          >
            <span v-if="num.value !== null" class="number-value">{{ num.value }}</span>
          </div>
        </div>

        <div class="temp-area">
          <div class="min-found-area">
            <div class="temp-label label-min-found">Mínimo Encontrado</div>
            <div 
              class="min-found-box number-wrapper"
              @click="confirmMinimumSelection"
              :class="{ 'has-value': confirmedMinId !== null, 'clickable': selectedId !== null }"
            >
              <span v-if="confirmedMinId" class="number-value">{{ numbers.find(n => n.id === confirmedMinId)?.value }}</span>
            </div>
          </div>
          
          <div class="separator-vertical"></div>

          <div class="temp-var-area">
            <div class="temp-label">Variable Temporal</div>
            <div 
              class="temp-box number-wrapper" 
              :class="{ 'has-value': (isAnimating ? animatedState.temp !== null : false) }"
            >
              <span v-if="isAnimating && animatedState.temp" class="number-value">{{ animatedState.temp }}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="history-container" v-if="history.length > 0">
        <h2 class="history-title">Historial de Pasos</h2>
        <ul class="history-list">
          <li v-for="(move, index) in history" :key="index" class="history-item">{{ move }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');
.page-container {
  --fuchsia: #ff00ff;
  --purple: #8A2BE2;
  --pink: #FFC0CB;
  --bg-dark: #1a1a1a;
  --bg-light: #2a2a2a;
  --text-color: #f0f0f0;
  --sorted-color: #03dac6;
  --min-hint-color: #f0e68c;
  display: flex; justify-content: center; align-items: flex-start; min-height: 100vh;
  background-color: var(--bg-dark); font-family: 'Poppins', sans-serif; color: var(--text-color); padding: 2rem;
}
.container { width: 100%; max-width: 900px; text-align: center; }
.title { font-size: 2.5rem; font-weight: 600; color: var(--fuchsia); margin-bottom: 0.5rem; text-shadow: 0 0 10px var(--fuchsia); }
.subtitle { font-size: 1.1rem; color: var(--pink); margin-bottom: 1rem; }
.controls-container { display: flex; justify-content: center; align-items: center; gap: 1rem; margin-bottom: 1rem; min-height: 60px; background-color: rgba(42, 42, 42, 0.5); padding: 1rem; border-radius: 12px; }
.separator { width: 2px; height: 24px; background-color: var(--purple); margin: 0 0.5rem; }
.coach-hint { min-height: 2.5em; font-size: 1.1rem; color: var(--pink); margin-bottom: 1rem; font-style: italic; }
.main-area { display: flex; flex-direction: column; align-items: center; gap: 2rem; margin-bottom: 1rem; }
.numbers-container { display: flex; flex-wrap: wrap; justify-content: center; gap: 1rem; min-height: 96px; max-width: 600px; }

.temp-area { 
  display: flex; 
  gap: 2rem; 
  align-items: flex-start;
}
.min-found-area, .temp-var-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}
.separator-vertical {
  width: 2px;
  height: 80px; /* Match number-wrapper height */
  background-color: var(--purple);
  align-self: center;
  margin-top: 1.5rem; /* Align with boxes */
}

.temp-label { font-size: 1rem; font-weight: 600; color: var(--fuchsia); }

.label-min-found {
  color: var(--min-hint-color);
}

.history-container { width: 100%; max-width: 750px; margin: 1rem auto; background-color: var(--bg-light); padding: 1.5rem; border-radius: 12px; border: 1px solid var(--purple); text-align: left; }
.history-title { font-size: 1.5rem; color: var(--fuchsia); margin-bottom: 1rem; text-align: center; }
.history-list { list-style-type: none; padding: 0; margin: 0; max-height: 200px; overflow-y: auto; }
.history-item { background: var(--bg-dark); padding: 0.75rem; margin-bottom: 0.5rem; border-radius: 8px; border-left: 4px solid var(--fuchsia); }

.btn { padding: 0; border: none; font-weight: 600; cursor: pointer; transition: all 0.3s ease; color: white; }
.btn:disabled { opacity: 0.5; cursor: not-allowed; }
.btn-primary { background-color: var(--fuchsia); }
.btn-secondary { background-color: var(--purple); }
.btn-accent { background: linear-gradient(45deg, var(--fuchsia), var(--purple)); }
.btn-hint { background-color: var(--min-hint-color); color: #1a1a1a; }

.btn-icon {
  width: 50px; height: 50px; border-radius: 50%; font-size: 1.5rem; line-height: 0;
  display: flex; justify-content: center; align-items: center;
}
.btn-icon[title="Añadir Número"], .btn-icon[title="Quitar Número"] { font-size: 2rem; font-weight: bold; }

.number-wrapper {
  width: 80px; height: 80px; display: flex; justify-content: center; align-items: center;
  background-color: var(--bg-light); border: 2px solid var(--purple); border-radius: 12px;
  transition: all 0.3s ease; position: relative; cursor: default;
}
.number-wrapper:not(.sorted):not(.empty) { cursor: pointer; }

.number-value { font-size: 1.8rem; font-weight: 600; }
.number-wrapper.empty { background-color: #2e2e2e; border-style: dashed; }
.number-wrapper.sorted { border-color: var(--sorted-color); opacity: 0.6; }
.number-wrapper.selected { transform: scale(1.1); box-shadow: 0 0 20px white; border-color: white; }

.min-found-box { 
  border-style: dashed;
  border-color: var(--min-hint-color); /* Yellow border */
}
.min-found-box.clickable { cursor: pointer; border-color: var(--pink); }
.min-found-box.has-value, .temp-box.has-value { border-style: solid; border-color: var(--fuchsia); box-shadow: 0 0 20px var(--fuchsia); }
.temp-box { border-style: dashed; cursor: default; }

.number-wrapper.is-swap-target:not(.sorted) { box-shadow: 0 0 20px var(--fuchsia); }
.number-wrapper.is-actual-min:not(.sorted) { border-color: var(--min-hint-color); }
.number-wrapper.is-actual-min:not(.sorted)::after {
  content: 'Mín'; position: absolute; top: -10px; right: -10px; background: var(--min-hint-color);
  color: black; font-size: 0.7rem; font-weight: bold; padding: 2px 4px; border-radius: 4px;
}
</style>