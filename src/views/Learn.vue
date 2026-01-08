<template>
  <div class="min-h-screen bg-gray-50 text-gray-800">
    <div class="container mx-auto p-4 md:p-8">
      <!-- Título con gradiente -->
      <h1
        class="text-3xl md:text-4xl font-extrabold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-teal-500"
      >
        Completa el algoritmo de Selection Sort
      </h1>

      <!-- Panel de Ejercicio Centrado -->
      <div class="max-w-6xl mx-auto">
        <div class="bg-white border-2 border-blue-200 rounded-xl shadow-lg p-6">

          <div class="flex flex-col lg:flex-row gap-8">
            <!-- Columna Izquierda: Código y Controles -->
            <div class="flex-1">
              <!-- Selector de Lenguaje -->
              <div class="bg-gradient-to-r from-purple-100 to-blue-100 border-2 border-purple-300 rounded-lg p-4 mb-6">
                <div class="flex justify-center gap-6">
                  <label v-for="lang in ['cpp', 'python', 'java']" :key="lang" class="lang-option">
                    <input type="radio" v-model="selectedLanguage" :value="lang" class="mr-2" />
                    <span class="font-bold text-purple-900">
                      {{ lang === 'cpp' ? 'C++' : lang.charAt(0).toUpperCase() + lang.slice(1) }}
                    </span>
                  </label>
                </div>
              </div>

              <!-- Bloque de Código -->
              <div class="bg-slate-50 border-2 border-slate-200 rounded-lg p-6 mb-6 overflow-x-auto">
                <!-- C++ Code Block -->
                <pre class="code-block" v-if="selectedLanguage === 'cpp'">
for (int i = 0; i < <div class="inline-flex items-center gap-1"><select v-model="answers.cpp.gap1" @change="onChangeAnswer('cpp')" :class="{ 'correct': verified.cpp && isCorrect('cpp', 'gap1'), 'incorrect': verified.cpp && !isCorrect('cpp', 'gap1') }">
  <option value="" disabled selected>...</option>
  <option v-for="opt in options.gap1" :key="opt" :value="opt">{{ opt }}</option>
</select><button v-if="verified.cpp && !isCorrect('cpp', 'gap1')" @click="showError('gap1')" class="help-btn">?</button></div>; i++) {
    int minIndex = i;
    for (int j = <div class="inline-flex items-center gap-1"><select v-model="answers.cpp.gap2" @change="onChangeAnswer('cpp')" :class="{ 'correct': verified.cpp && isCorrect('cpp', 'gap2'), 'incorrect': verified.cpp && !isCorrect('cpp', 'gap2') }">
  <option value="" disabled selected>...</option>
  <option v-for="opt in options.gap2" :key="opt" :value="opt">{{ opt }}</option>
</select><button v-if="verified.cpp && !isCorrect('cpp', 'gap2')" @click="showError('gap2')" class="help-btn">?</button></div>; j < n; j++) {
        if (a[j] < <div class="inline-flex items-center gap-1"><select v-model="answers.cpp.gap3" @change="onChangeAnswer('cpp')" :class="{ 'correct': verified.cpp && isCorrect('cpp', 'gap3'), 'incorrect': verified.cpp && !isCorrect('cpp', 'gap3') }">
  <option value="" disabled selected>...</option>
  <option v-for="opt in options.gap3" :key="opt" :value="opt">{{ opt }}</option>
</select><button v-if="verified.cpp && !isCorrect('cpp', 'gap3')" @click="showError('gap3')" class="help-btn">?</button></div>) {
            minIndex = j;
        }
    }
    if (minIndex != i) {
        int temp = a[i];
        a[i] = a[minIndex];
        a[minIndex] = temp;
    }
}
                </pre>

                <!-- Python Code Block -->
                <pre class="code-block" v-else-if="selectedLanguage === 'python'">
for i in range(<div class="inline-flex items-center gap-1"><select v-model="answers.python.gap1" @change="onChangeAnswer('python')" :class="{ 'correct': verified.python && isCorrect('python', 'gap1'), 'incorrect': verified.python && !isCorrect('python', 'gap1') }">
  <option value="" disabled selected>...</option>
  <option v-for="opt in options.gap1" :key="opt" :value="opt">{{ opt }}</option>
</select><button v-if="verified.python && !isCorrect('python', 'gap1')" @click="showError('gap1')" class="help-btn">?</button></div>):
    min_index = i
    for j in range(<div class="inline-flex items-center gap-1"><select v-model="answers.python.gap2" @change="onChangeAnswer('python')" :class="{ 'correct': verified.python && isCorrect('python', 'gap2'), 'incorrect': verified.python && !isCorrect('python', 'gap2') }">
  <option value="" disabled selected>...</option>
  <option v-for="opt in options.gap2" :key="opt" :value="opt">{{ opt }}</option>
</select><button v-if="verified.python && !isCorrect('python', 'gap2')" @click="showError('gap2')" class="help-btn">?</button></div>, n):
        if a[j] < <div class="inline-flex items-center gap-1"><select v-model="answers.python.gap3" @change="onChangeAnswer('python')" :class="{ 'correct': verified.python && isCorrect('python', 'gap3'), 'incorrect': verified.python && !isCorrect('python', 'gap3') }">
  <option value="" disabled selected>...</option>
  <option v-for="opt in options.gap3" :key="opt" :value="opt">{{ opt }}</option>
</select><button v-if="verified.python && !isCorrect('python', 'gap3')" @click="showError('gap3')" class="help-btn">?</button></div>:
            min_index = j
    if min_index != i:
        temp = a[i]
        a[i] = a[min_index]
        a[min_index] = temp
                </pre>

                <!-- Java Code Block -->
                <pre class="code-block" v-else-if="selectedLanguage === 'java'">
for (int i = 0; i < <div class="inline-flex items-center gap-1"><select v-model="answers.java.gap1" @change="onChangeAnswer('java')" :class="{ 'correct': verified.java && isCorrect('java', 'gap1'), 'incorrect': verified.java && !isCorrect('java', 'gap1') }">
  <option value="" disabled selected>...</option>
  <option v-for="opt in options.gap1" :key="opt" :value="opt">{{ opt }}</option>
</select><button v-if="verified.java && !isCorrect('java', 'gap1')" @click="showError('gap1')" class="help-btn">?</button></div>; i++) {
    int minIndex = i;
    for (int j = <div class="inline-flex items-center gap-1"><select v-model="answers.java.gap2" @change="onChangeAnswer('java')" :class="{ 'correct': verified.java && isCorrect('java', 'gap2'), 'incorrect': verified.java && !isCorrect('java', 'gap2') }">
  <option value="" disabled selected>...</option>
  <option v-for="opt in options.gap2" :key="opt" :value="opt">{{ opt }}</option>
</select><button v-if="verified.java && !isCorrect('java', 'gap2')" @click="showError('gap2')" class="help-btn">?</button></div>; j < n; j++) {
        if (a[j] < <div class="inline-flex items-center gap-1"><select v-model="answers.java.gap3" @change="onChangeAnswer('java')" :class="{ 'correct': verified.java && isCorrect('java', 'gap3'), 'incorrect': verified.java && !isCorrect('java', 'gap3') }">
  <option value="" disabled selected>...</option>
  <option v-for="opt in options.gap3" :key="opt" :value="opt">{{ opt }}</option>
</select><button v-if="verified.java && !isCorrect('java', 'gap3')" @click="showError('gap3')" class="help-btn">?</button></div>) {
            minIndex = j;
        }
    }
    if (minIndex != i) {
        int temp = a[i];
        a[i] = a[minIndex];
        a[minIndex] = temp;
    }
}
                </pre>
              </div>

              <!-- Botones de Acción -->
              <div class="flex justify-center gap-4 mb-6">
                <button
                  @click="reset"
                  class="px-6 py-2 bg-slate-200 text-slate-700 font-bold rounded-lg hover:bg-slate-300 transition-colors"
                >
                  Restablecer
                </button>
                <button
                  @click="verify"
                  class="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-md"
                >
                  Verificar
                </button>
              </div>

              <!-- Feedback existente -->
              <div v-if="verified[selectedLanguage]">
                <div
                  v-if="allCorrect"
                  class="bg-green-50 border-2 border-green-400 rounded-lg p-4 text-center"
                >
                  <p class="text-green-800 font-bold text-lg">✓ ¡Correcto! Has completado el algoritmo correctamente.</p>
                </div>
                 <div
                  v-else
                  class="bg-red-50 border-2 border-red-400 rounded-lg p-4"
                >
                  <p class="text-red-800 font-bold mb-3">✗ Hay errores en tu código, presiona el boton ? para saber mas detalles:</p>
                  <ul class="space-y-2">
                    <li
                      v-for="(msg, gap) in feedbackMessages"
                      :key="gap"
                      class="text-red-700 text-sm"
                    >
                      <strong>{{ gap.replace('gap', 'Espacio ') }}:</strong> {{ msg }}
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <!-- Columna Derecha: Panel de Explicación Visual -->
            <transition name="slide-fade">
              <div v-if="selectedErrorData" class="w-full lg:w-96 bg-white border-l-4 border-amber-400 shadow-xl p-6 rounded-r-lg flex flex-col gap-6">
                <div class="flex justify-between items-start">
                  <h3 class="text-xl font-bold text-gray-800">¿Por qué es incorrecto?</h3>
                  <button @click="selectedError = null" class="text-gray-400 hover:text-gray-600">
                    <span class="text-2xl">×</span>
                  </button>
                </div>

                <!-- Sección: Lo que está pasando (Error) -->
                <div class="space-y-3">
                  <div class="flex items-center gap-2 mb-2">
                    <span class="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-bold uppercase tracking-wider">Tu intento: "{{ selectedErrorValue }}"</span>
                  </div>
                  <div class="bg-gray-100 p-4 rounded-lg border border-gray-200">
                    <p class="text-sm text-gray-600 mb-4">{{ selectedErrorData.errorText }}</p>

                    <!-- Visualización Dinámica -->
                     <div class="relative h-20 flex justify-center items-center font-mono text-sm mb-2">
                        <!-- Array Elements -->
                        <div class="flex gap-2">
                            <div v-for="(val, idx) in selectedErrorData.visualState.array" :key="idx"
                                class="relative w-10 h-10 flex items-center justify-center border-2 rounded transition-colors bg-white"
                                :class="getCellClass(idx, selectedErrorData.visualState)"
                            >
                              {{ val }}
                              <!-- Index Label -->
                              <span class="absolute -bottom-6 text-xs text-slate-400">{{ idx }}</span>
                            </div>

                            <!-- Ghost Element (for OutOfBounds) -->
                            <div v-if="selectedErrorData.visualState.ghostIndex"
                                 class="relative w-10 h-10 flex items-center justify-center border-2 border-dashed border-red-400 bg-red-50 rounded opacity-70"
                            >
                                <span class="text-xs text-red-600 font-bold">NULL</span>
                                <span class="absolute -bottom-6 text-xs text-red-400">{{ selectedErrorData.visualState.ghostIndex }}</span>
                            </div>
                        </div>
                     </div>
                     <div class="text-center text-xs text-red-600 font-bold mt-2">
                       {{ selectedErrorData.errorLabel }}
                     </div>
                  </div>
                </div>

                <!-- Separador -->
                <div class="border-t border-gray-100"></div>

                <!-- Sección: Forma Correcta -->
                <div class="space-y-3">
                   <div class="flex items-center gap-2 mb-2">
                    <span class="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold uppercase tracking-wider">Solución Correcta</span>
                  </div>
                  <div class="bg-blue-50 p-4 rounded-lg border border-blue-100">
                    <p class="text-sm text-gray-600 mb-3">{{ selectedErrorData.correctText }}</p>
                     <div class="text-center text-xs text-green-600 font-bold">
                       {{ selectedErrorData.correctLabel }}
                     </div>
                  </div>
                </div>

              </div>
            </transition>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';

type Language = 'cpp' | 'python' | 'java';
type GapKey = 'gap1' | 'gap2' | 'gap3';

const selectedLanguage = ref<Language>('cpp');
const selectedError = ref<GapKey | null>(null);

const options = {
  gap1: ['n', 'n - 1', 'n + 1'],
  gap2: ['i', 'i + 1', '0'],
  gap3: ['a[minIndex]', 'a[i]', 'a[j]'],
};

const correctAnswers = {
  gap1: 'n - 1',
  gap2: 'i + 1',
  gap3: 'a[minIndex]',
};

const feedbackHints = {
  gap1: 'El bucle externo debe ir hasta el penúltimo elemento.',
  gap2: 'El bucle interno busca desde el siguiente elemento a i.',
  gap3: 'Debes comparar el elemento actual con el mínimo encontrado.',
};

// Data structures for visualizer
interface VisualState {
  array: number[];
  highlightIdx?: number;     // Index to outline/highlight
  ghostIndex?: number;       // Index to show as missing/ghost
  highlightColor?: string;   // Tailwind class, default red-500
}

interface ExplanationData {
  errorText: string;
  errorLabel: string;
  correctText: string;
  correctLabel: string;
  visualState: VisualState;
}

// Helper to styles
const getCellClass = (idx: number, state: VisualState) => {
    if (state.highlightIdx === idx) {
        return `border-red-500 bg-red-50 font-bold text-red-700`;
    }
    return 'border-gray-300 text-gray-400';
}

const getExplanation = (gap: GapKey, userAnswer: string): ExplanationData | null => {
    // GAP 1: Loop Limit
    if (gap === 'gap1') {
        if (userAnswer === 'n') {
            return {
                errorText: 'Al ir hasta "n", el bucle ejecuta una iteración extra para el último elemento.',
                errorLabel: 'Elemento final (i) sin parejas',
                correctText: 'El último elemento ya está colocado si todos los anteriores lo están. Ahorramos 1 paso.',
                correctLabel: 'Paramos en n-1',
                visualState: { array: [2, 5, 8], highlightIdx: 2 }
            };
        }
        if (userAnswer === 'n + 1') {
             return {
                errorText: '¡Cuidado! "n + 1" intenta acceder a una posición de memoria que no existe.',
                errorLabel: '❌ ERROR DE MEMORIA (Crash)',
                correctText: 'Nunca debemos salirnos de los límites del arreglo [0 ... n-1].',
                correctLabel: 'Mantente dentro del array',
                visualState: { array: [2, 5, 8], ghostIndex: 3, highlightIdx: -1 }
            };
        }
    }

    // GAP 2: Inner Loop Start
    if (gap === 'gap2') {
         if (userAnswer === '0') {
             return {
                errorText: 'Si j empieza en 0, revisas la parte que YA está ordenada (izquierda).',
                errorLabel: 'Revisando lo ya ordenado',
                correctText: 'Solo nos interesa buscar mínimos en la parte desordenada (derecha).',
                correctLabel: 'Busca a la derecha de i',
                visualState: { array: [2, 8, 5], highlightIdx: 0 } // index 0 is already sorted, j checking it is waste
            };
         }
         // default generic for other errors in gap2
          return {
                errorText: 'Posición de inicio incorrecta para el bucle interno.',
                errorLabel: 'Inicio inválido',
                correctText: 'Debemos empezar justo después de la posición actual i.',
                correctLabel: 'j = i + 1',
                visualState: { array: [2, 5, 8], highlightIdx: 1 }
            };
    }

    // GAP 3: Comparison Logic
    if (gap === 'gap3') {
        if (userAnswer === 'a[i]') {
            // Context: [10, 8, 9]. i points to 10. minIndex points to 8. we check 9.
            // 9 < 10 (True). We take 9 as min. WRONG. 8 was smaller.
             return {
                errorText: 'Comparas contra a[i] (10), ignorando que ya encontraste un 8 antes.',
                errorLabel: 'Pierdes el valor mínimo real',
                correctText: 'Siempre compara contra el "campeón actual" (a[minIndex]).',
                correctLabel: 'Compara con el Mínimo',
                visualState: { array: [10, 8, 9], highlightIdx: 1 } // Highlight the 8 that was ignored
            };
        }
        if (userAnswer === 'a[j]') {
             return {
                errorText: 'Estás preguntando "¿ES 5 MENOR QUE 5?". Eso siempre es falso.',
                errorLabel: 'Comparación consigo mismo',
                correctText: 'Necesitamos comparar dos elementos DIFERENTES para ordenar.',
                correctLabel: 'Lógica inválida',
                visualState: { array: [5, 2], highlightIdx: 1 } // j points to 1 loop logic broken
            };
        }
    }

    // Fallback
    return {
        errorText: 'Respuesta incorrecta.',
        errorLabel: 'Error',
        correctText: 'Revisa la lógica del algoritmo.',
        correctLabel: 'Corrección',
        visualState: { array: [1, 2, 3] }
    };
};


const answers = reactive({
  cpp: { gap1: '', gap2: '', gap3: '' },
  python: { gap1: '', gap2: '', gap3: '' },
  java: { gap1: '', gap2: '', gap3: '' },
});

const verified = reactive({
  cpp: false,
  python: false,
  java: false,
});

const isCorrect = (lang: Language, gap: GapKey) => {
  return answers[lang][gap] === correctAnswers[gap];
};

const onChangeAnswer = (lang: Language) => {
  verified[lang] = false;
  selectedError.value = null; // Ocultar panel al cambiar
};

const showError = (gap: GapKey) => {
  selectedError.value = gap;
};

// Computed property to get the specific explanation for the CURRENTLY selected error context
const selectedErrorValue = computed(() => {
    if (!selectedError.value) return '';
    return answers[selectedLanguage.value][selectedError.value];
});

const selectedErrorData = computed(() => {
    if (!selectedError.value) return null;
    return getExplanation(selectedError.value, selectedErrorValue.value);
});


const allCorrect = computed(() => {
  const lang = selectedLanguage.value;
  return (Object.keys(correctAnswers) as GapKey[]).every((key) => isCorrect(lang, key));
});

const feedbackMessages = computed(() => {
  const lang = selectedLanguage.value;
  const messages: Record<string, string> = {};
  (Object.keys(correctAnswers) as GapKey[]).forEach(gap => {
    if (answers[lang][gap] === '') {
      messages[gap] = 'Debes seleccionar una opción.';
    } else if (!isCorrect(lang, gap)) {
      messages[gap] = feedbackHints[gap];
    }
  });
  return messages;
});

const reset = () => {
  const lang = selectedLanguage.value;
  answers[lang].gap1 = '';
  answers[lang].gap2 = '';
  answers[lang].gap3 = '';
  verified[lang] = false;
  selectedError.value = null;
};

const verify = () => {
  verified[selectedLanguage.value] = true;
  selectedError.value = null; // Reiniciar selección al verificar
};
</script>

<style scoped>
.code-block {
  margin: 0;
  white-space: pre-wrap;
  font-size: 0.95rem;
  color: #2c3e50;
  font-family: 'Courier New', Courier, monospace;
  line-height: 1.6;
}

select {
  padding: 3px 8px;
  font-size: 0.9rem;
  border: 2px solid #94a3b8;
  border-radius: 6px;
  background-color: #fff;
  cursor: pointer;
  transition: all 0.2s;
  font-family: 'Courier New', Courier, monospace;
}

select:hover {
  border-color: #64748b;
}

select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.correct {
  background-color: #d1fae5 !important;
  border-color: #10b981 !important;
  color: #065f46 !important;
}

.incorrect {
  background-color: #fee2e2 !important;
  border-color: #ef4444 !important;
  color: #991b1b !important;
}

.lang-option {
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: all 0.2s;
}

.lang-option:hover {
  transform: translateY(-1px);
}

.lang-option input[type="radio"] {
  cursor: pointer;
  width: 18px;
  height: 18px;
}

.help-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: #fee2e2;
  color: #ef4444;
  font-weight: bold;
  font-size: 14px;
  border: 1px solid #fecaca;
  cursor: pointer;
  transition: all 0.2s;
  margin-left: 6px;
  animation: pulse-soft 2s infinite;
}

.help-btn:hover {
  background-color: #fecaca;
  transform: scale(1.1);
  animation: none; /* Stop pulsing on hover */
}

@keyframes pulse-soft {
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4);
  }
  70% {
    transform: scale(1.1);
    box-shadow: 0 0 0 6px rgba(239, 68, 68, 0);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(239, 68, 68, 0);
  }
}

/* Transiciones para el panel lateral */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease-out;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
</style>
