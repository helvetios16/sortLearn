<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { v4 as uuidv4 } from 'uuid';

// --- Core State ---
const numbers = ref<{ id: string; value: number }[]>([]);
const selectedIds = ref<string[]>([]);
const history = ref<string[]>([]);
const isAnimating = ref(false);

// Visual state for the animation
const animatedState = ref<{
  numbers: { id: string; value: number | null }[],
  temp: number | null,
}>({ numbers: [], temp: null });


// --- Selection Sort Helper State ---
const sortedBoundaryIndex = ref(0);
const isPracticeStarted = ref(false);
const showMinHint = ref(false);
const isHintOnCooldown = ref(false);


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
  if (isAnimating.value) {
    if (animatedState.value.temp === null) { // This means the 2-second delay is active
      return "Preparando para intercambiar...";
    }
    return "Observa cómo funciona el intercambio...";
  }
  if (!isPracticeStarted.value) return "Prepara tu lista y haz clic en 'Empezar a Practicar'.";
  if (sortedBoundaryIndex.value >= numbers.value.length) return "¡Felicidades! Has ordenado la lista.";
  
  if (selectedIds.value.length < 2) {
    return `Selecciona dos números para intercambiar. El objetivo es llevar el mínimo (color amarillo) a la posición resaltada (color fucsia).`;
  }
  return "¡Listo para intercambiar! Presiona el botón.";
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
  if (isPracticeStarted.value || numbers.value.length >= 15) return;
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
  selectedIds.value = [];
  sortedBoundaryIndex.value = 0;
  isPracticeStarted.value = false;
  isAnimating.value = false;
  animatedState.value = { numbers: [], temp: null };
  showMinHint.value = false;
  isHintOnCooldown.value = false;
}

function selectItem(id: string) {
  if (isAnimating.value || !isPracticeStarted.value) return;

  const index = selectedIds.value.indexOf(id);
  if (index > -1) {
    selectedIds.value.splice(index, 1);
  } else if (selectedIds.value.length < 2) {
    selectedIds.value.push(id);
  }
}

function initiateSwapSequence(idA: string, idB: string) {
  isAnimating.value = true; // Disable interactions
  history.value.push("Preparando para el intercambio...");
  
  setTimeout(() => {
    performAnimatedSwap(idA, idB);
  }, 2000); // 2-second delay before animation starts
}


function performAnimatedSwap(idA: string, idB: string) {
  // Check if the IDs are valid and belong to numbers
  const numA = numbers.value.find(n => n.id === idA);
  const numB = numbers.value.find(n => n.id === idB);

  if (!numA || !numB) {
    console.error("Invalid IDs provided for swap:", idA, idB);
    isAnimating.value = false;
    selectedIds.value = [];
    return;
  }

  // Determine if it was a "correct" swap for Selection Sort
  const wasCorrectSwap = (idA === actualMinInUnsorted.value?.id && idB === swapTargetId.value) ||
                         (idB === actualMinInUnsorted.value?.id && idA === swapTargetId.value);

  const indexA = numbers.value.findIndex(n => n.id === idA);
  const indexB = numbers.value.findIndex(n => n.id === idB);
  const valA = numbers.value[indexA].value;
  const valB = numbers.value[indexB].value;
  
  // Initial state for animation
  animatedState.value.numbers = JSON.parse(JSON.stringify(numbers.value));
  animatedState.value.temp = null;

  // Step 1: A -> temp
  setTimeout(() => {
    animatedState.value.temp = valA;
    animatedState.value.numbers[indexA].value = null;
    history.value.push(`1. Guardando ${valA} en la variable temporal.`);
  }, 500);

  // Step 2: B -> A
  setTimeout(() => {
    animatedState.value.numbers[indexA].value = valB;
    animatedState.value.numbers[indexB].value = null;
    history.value.push(`2. Moviendo ${valB} a la posición del primer número.`);
  }, 1500);

  // Step 3: temp -> B
  setTimeout(() => {
    animatedState.value.numbers[indexB].value = valA;
    animatedState.value.temp = null;
    history.value.push(`3. Moviendo ${valA} desde la temporal a la segunda posición.`);
  }, 2500);

  // Finalization
  setTimeout(() => {
    // Update the actual data model
    [numbers.value[indexA].value, numbers.value[indexB].value] = [valB, valA];
    
    if (wasCorrectSwap) {
       history.value.push(`¡Bien hecho! ${actualMinInUnsorted.value?.value} está en la posición correcta.`);
       sortedBoundaryIndex.value++;
    } else {
       history.value.push(`Intercambio completado. (Para Selection Sort, busca el mínimo de la sección no ordenada).`);
    }

    selectedIds.value = [];
    isAnimating.value = false;
  }, 3500);
}

</script>

<template>
  <div class="page-container">
    <div class="container">
      <h1 class="title">Practicando Selection Sort</h1>
      <p class="subtitle">Selecciona dos números y observa cómo se intercambian usando una variable temporal.</p>
      
      <div class="controls-container">
        <button v-if="!isPracticeStarted" @click="addNumber" class="btn btn-icon btn-primary" title="Añadir Número" :disabled="numbers.value.length >= 15">+</button>
        <button v-if="!isPracticeStarted" @click="removeNumber" class="btn btn-icon btn-secondary" title="Quitar Número" :disabled="numbers.length === 0">-</button>
        
        <div v-if="!isPracticeStarted && numbers.length > 0" class="separator"></div>

        <button v-if="!isPracticeStarted && numbers.length > 0" @click="startPractice" class="btn btn-icon btn-accent" title="Empezar a Practicar">▶</button>
        <button @click="reset" class="btn btn-icon btn-secondary" title="Reiniciar">↻</button>
        
        <div v-if="isPracticeStarted && sortedBoundaryIndex < numbers.length" class="separator"></div>
        
        <button v-if="isPracticeStarted && sortedBoundaryIndex < numbers.length" @click="triggerMinHint" class="btn btn-icon btn-hint" title="Mostrar Pista del Mínimo" :disabled="isHintOnCooldown || showMinHint">💡</button>
      </div>

      <div class="main-swap-controls">
         <button v-if="isPracticeStarted && selectedIds.length === 2" @click="initiateSwapSequence(selectedIds[0], selectedIds[1])" class="btn btn-accent" :disabled="isAnimating">Realizar Intercambio ⇄</button>
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
              'selected': selectedIds.includes(num.id),
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
              :class="{ 'has-value': (isAnimating ? animatedState.temp !== null : false) }"
            >
              <span v-if="isAnimating && animatedState.temp" class="number-value">{{ animatedState.temp }}</span>
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
          <li v-for="(move, index) in history" :key="index">{{ move }}</li>
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
.container { width: 100%; max-width: 1050px; text-align: center; }
.title { font-size: 2.5rem; font-weight: 600; color: var(--fuchsia); margin-bottom: 0.5rem; text-shadow: 0 0 10px var(--fuchsia); }
.subtitle { font-size: 1.1rem; color: var(--pink); margin-bottom: 1rem; }
.controls-container { display: flex; justify-content: center; align-items: center; gap: 1rem; margin-bottom: 1rem; min-height: 60px; background-color: rgba(42, 42, 42, 0.5); padding: 1rem; border-radius: 12px; }
.separator { width: 2px; height: 24px; background-color: var(--purple); margin: 0 0.5rem; }
.coach-hint { min-height: 2.5em; font-size: 1.1rem; color: var(--pink); margin-bottom: 1rem; font-style: italic; }
.main-swap-controls { min-height: 60px; display: flex; justify-content: center; align-items: center; margin-bottom: 1rem; }
.main-area { display: flex; flex-direction: column; align-items: center; gap: 2rem; margin-bottom: 1rem; }
.numbers-container { display: flex; flex-wrap: wrap; justify-content: center; gap: 1rem; min-height: 272px; max-width: 980px; }

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

.btn { padding: 0.8rem 1.5rem; border: none; font-weight: 600; cursor: pointer; transition: all 0.3s ease; color: white; border-radius: 8px; }
.btn:disabled { opacity: 0.5; cursor: not-allowed; }
.btn-primary { background-color: var(--fuchsia); }
.btn-secondary { background-color: var(--purple); }
.btn-accent { background: linear-gradient(45deg, var(--fuchsia), var(--purple)); }
.btn-hint { background-color: var(--min-hint-color); color: #1a1a1a; }

.btn-icon {
  width: 50px; height: 50px; border-radius: 50%; font-size: 1.5rem; line-height: 0;
  display: flex; justify-content: center; align-items: center; padding: 0;
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
.min-found-box.has-value { border-style: solid; border-color: var(--fuchsia); box-shadow: 0 0 20px var(--fuchsia); }
.temp-box { border-style: dashed; cursor: default; }
.temp-box.has-value { border-style: solid; border-color: var(--fuchsia); box-shadow: 0 0 20px var(--fuchsia); }

.number-wrapper.is-swap-target:not(.sorted) { box-shadow: 0 0 20px var(--fuchsia); }
.number-wrapper.is-actual-min:not(.sorted) { border-color: var(--min-hint-color); }
.number-wrapper.is-actual-min:not(.sorted)::after {
  content: 'Mín'; position: absolute; top: -10px; right: -10px; background: var(--min-hint-color);
  color: black; font-size: 0.7rem; font-weight: bold; padding: 2px 4px; border-radius: 4px;
}
</style>
