<template>
  <div class="container-wrapper">
    <!-- Título encima de ambos cuadros -->
    <h2 class="main-title">Completa el algoritmo de Selection Sort</h2>

    <div class="main-layout">
      <!-- Panel Izquierdo: Ejemplos -->
      <div class="examples-panel">
        <h3>Ejemplos de Referencia</h3>
        
        <!-- Selector de Lenguaje con estilo sombreado (igual al derecho) -->
        <div class="language-selector">
          <label v-for="lang in ['cpp', 'python', 'java']" :key="'ex-'+lang" class="lang-option">
            <input type="radio" v-model="exampleLanguage" :value="lang" />
            {{ lang === 'cpp' ? 'C++' : lang.charAt(0).toUpperCase() + lang.slice(1) }}
          </label>
        </div>

        <div class="example-selector">
          <button
            v-for="type in ['for', 'if', 'nestedFor']"
            :key="type"
            @click="selectedExample = type"
            :class="{ 'active-btn': selectedExample === type }"
            class="selector-btn"
          >
            {{ type === 'nestedFor' ? 'Doble For' : type.charAt(0).toUpperCase() + type.slice(1) }}
          </button>
        </div>

        <div class="example-content">
          <div v-if="selectedExample === 'for'">
            <p><strong>Bucle For:</strong> Repite un bloque de código un número determinado de veces.</p>
            <pre class="example-code">{{ examples[exampleLanguage].for }}</pre>
          </div>

          <div v-else-if="selectedExample === 'if'">
            <p><strong>Sentencia If:</strong> Evalúa una condición y ejecuta el código si es verdadera.</p>
            <pre class="example-code">{{ examples[exampleLanguage].if }}</pre>
          </div>

          <div v-else-if="selectedExample === 'nestedFor'">
            <p><strong>For anidado:</strong> Un bucle dentro de otro. El externo controla las repeticiones principales.</p>
            <pre class="example-code">{{ examples[exampleLanguage].nestedFor }}</pre>
          </div>
        </div>
      </div>

      <!-- Panel Derecho: Ejercicio -->
      <div class="selection-sort-container">
        <h3>Ejercicio Práctico</h3>
        
        <div class="language-selector">
          <label v-for="lang in ['cpp', 'python', 'java']" :key="'exercise-'+lang" class="lang-option">
            <input type="radio" v-model="selectedLanguage" :value="lang" />
            {{ lang === 'cpp' ? 'C++' : lang.charAt(0).toUpperCase() + lang.slice(1) }}
          </label>
        </div>

        <div class="algorithm-box">
          <!-- C++ Code Block -->
          <pre class="code-block" v-if="selectedLanguage === 'cpp'">
for (int i = 0; i < <select v-model="answers.cpp.gap1" @change="onChangeAnswer('cpp')" :class="{ 'correct': verified.cpp && isCorrect('cpp', 'gap1'), 'incorrect': verified.cpp && !isCorrect('cpp', 'gap1') }">
  <option value="" disabled selected>...</option>
  <option v-for="opt in options.gap1" :key="opt" :value="opt">{{ opt }}</option>
</select>; i++) {
    int minIndex = i;
    for (int j = <select v-model="answers.cpp.gap2" @change="onChangeAnswer('cpp')" :class="{ 'correct': verified.cpp && isCorrect('cpp', 'gap2'), 'incorrect': verified.cpp && !isCorrect('cpp', 'gap2') }">
  <option value="" disabled selected>...</option>
  <option v-for="opt in options.gap2" :key="opt" :value="opt">{{ opt }}</option>
</select>; j < n; j++) {
        if (a[j] < <select v-model="answers.cpp.gap3" @change="onChangeAnswer('cpp')" :class="{ 'correct': verified.cpp && isCorrect('cpp', 'gap3'), 'incorrect': verified.cpp && !isCorrect('cpp', 'gap3') }">
  <option value="" disabled selected>...</option>
  <option v-for="opt in options.gap3" :key="opt" :value="opt">{{ opt }}</option>
</select>) {
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
for i in range(<select v-model="answers.python.gap1" @change="onChangeAnswer('python')" :class="{ 'correct': verified.python && isCorrect('python', 'gap1'), 'incorrect': verified.python && !isCorrect('python', 'gap1') }">
  <option value="" disabled selected>...</option>
  <option v-for="opt in options.gap1" :key="opt" :value="opt">{{ opt }}</option>
</select>):
    min_index = i
    for j in range(<select v-model="answers.python.gap2" @change="onChangeAnswer('python')" :class="{ 'correct': verified.python && isCorrect('python', 'gap2'), 'incorrect': verified.python && !isCorrect('python', 'gap2') }">
  <option value="" disabled selected>...</option>
  <option v-for="opt in options.gap2" :key="opt" :value="opt">{{ opt }}</option>
</select>, n):
        if a[j] < <select v-model="answers.python.gap3" @change="onChangeAnswer('python')" :class="{ 'correct': verified.python && isCorrect('python', 'gap3'), 'incorrect': verified.python && !isCorrect('python', 'gap3') }">
  <option value="" disabled selected>...</option>
  <option v-for="opt in options.gap3" :key="opt" :value="opt">{{ opt }}</option>
</select>:
            min_index = j
    if min_index != i:
        a[i], a[min_index] = a[min_index], a[i]
          </pre>

          <!-- Java Code Block -->
          <pre class="code-block" v-else-if="selectedLanguage === 'java'">
for (int i = 0; i < <select v-model="answers.java.gap1" @change="onChangeAnswer('java')" :class="{ 'correct': verified.java && isCorrect('java', 'gap1'), 'incorrect': verified.java && !isCorrect('java', 'gap1') }">
  <option value="" disabled selected>...</option>
  <option v-for="opt in options.gap1" :key="opt" :value="opt">{{ opt }}</option>
</select>; i++) {
    int minIndex = i;
    for (int j = <select v-model="answers.java.gap2" @change="onChangeAnswer('java')" :class="{ 'correct': verified.java && isCorrect('java', 'gap2'), 'incorrect': verified.java && !isCorrect('java', 'gap2') }">
  <option value="" disabled selected>...</option>
  <option v-for="opt in options.gap2" :key="opt" :value="opt">{{ opt }}</option>
</select>; j < n; j++) {
        if (a[j] < <select v-model="answers.java.gap3" @change="onChangeAnswer('java')" :class="{ 'correct': verified.java && isCorrect('java', 'gap3'), 'incorrect': verified.java && !isCorrect('java', 'gap3') }">
  <option value="" disabled selected>...</option>
  <option v-for="opt in options.gap3" :key="opt" :value="opt">{{ opt }}</option>
</select>) {
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

        <div class="actions">
          <button @click="reset" class="btn reset-btn">Restablecer</button>
          <button @click="verify" class="btn verify-btn">Verificar</button>
        </div>

        <div v-if="verified[selectedLanguage]" class="feedback">
          <div v-if="allCorrect" class="success-msg">
            <p>¡Correcto! Has completado el algoritmo correctamente.</p>
          </div>
          <div v-else class="error-msg">
            <p>Hay errores en tu código:</p>
            <ul class="error-list">
              <li v-for="(msg, gap) in feedbackMessages" :key="gap">
                <strong>{{ gap.replace('gap', 'Espacio ') }}:</strong> {{ msg }}
              </li>
            </ul>
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
const exampleLanguage = ref<Language>('cpp');
const selectedExample = ref('for');

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

const examples = {
  cpp: {
    for: 'for (int i = 0; i < 3; i++) {\n    cout << "Iteracion: " << i << endl;\n}\n\n/* Salida:\nIteracion: 0\nIteracion: 1\nIteracion: 2\n*/',
    if: 'int edad = 18;\nif (edad >= 18) {\n    cout << "Es mayor de edad" << endl;\n}\n\n/* Salida:\nEs mayor de edad\n*/',
    nestedFor: 'for (int i = 0; i < 2; i++) {\n    for (int j = 0; j < 2; j++) {\n        cout << "i=" << i << ", j=" << j << " | ";\n    }\n    cout << endl;\n}\n\n/* Salida:\ni=0, j=0 | i=0, j=1 |\ni=1, j=0 | i=1, j=1 |\n*/'
  },
  python: {
    for: 'for i in range(3):\n    print(f"Iteracion: {i}")\n\n# Salida:\n# Iteracion: 0\n# Iteracion: 1\n# Iteracion: 2',
    if: 'edad = 18\nif edad >= 18:\n    print("Es mayor de edad")\n\n# Salida:\n# Es mayor de edad',
    nestedFor: 'for i in range(2):\n    for j in range(2):\n        print(f"i={i}, j={j}", end=" | ")\n    print()\n\n# Salida:\n# i=0, j=0 | i=0, j=1 |\n# i=1, j=0 | i=1, j=1 |'
  },
  java: {
    for: 'for (int i = 0; i < 3; i++) {\n    System.out.println("Iteracion: " + i);\n}\n\n// Salida:\n// Iteracion: 0\n// Iteracion: 1\n// Iteracion: 2',
    if: 'int edad = 18;\nif (edad >= 18) {\n    System.out.println("Es mayor de edad");\n}\n\n// Salida:\n// Es mayor de edad',
    nestedFor: 'for (int i = 0; i < 2; i++) {\n    for (int j = 0; j < 2; j++) {\n        System.out.print("i=" + i + ", j=" + j + " | ");\n    }\n    System.out.println();\n}\n\n// Salida:\n// i=0, j=0 | i=0, j=1 |\n// i=1, j=0 | i=1, j=1 |'
  }
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
};

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
};

const verify = () => {
  verified[selectedLanguage.value] = true;
};
</script>

<style scoped>
.container-wrapper {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 20px;
}

.main-title {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 30px;
  font-size: 2rem;
  font-weight: bold;
}

.main-layout {
  display: flex;
  gap: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.examples-panel {
  flex: 1;
  background: #fff;
  border: 2px solid #333;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.example-selector {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.selector-btn {
  padding: 8px 15px;
  border: 1px solid #ccc;
  background: #f0f0f0;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s;
}

.selector-btn:hover {
  background: #e0e0e0;
}

.active-btn {
  background: #3498db !important;
  color: white;
  border-color: #2980b9;
}

.example-content {
  background: #fff;
  padding: 15px;
  border-radius: 6px;
  border: 1px solid #eee;
}

.example-code {
  background: #ffffff;
  color: #2c3e50;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow-x: auto;
  font-family: 'Courier New', Courier, monospace;
  font-size: 0.85rem;
  margin-top: 10px;
  line-height: 1.4;
  white-space: pre-wrap;
}

.selection-sort-container {
  flex: 1.5;
  padding: 20px;
  border: 2px solid #333;
  border-radius: 8px;
  background-color: #f9f9f9;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.language-selector {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 15px;
  padding: 10px;
  background: #eee; /* Cuadro sombreado/oscuro unificado */
  border-radius: 6px;
}

.lang-option {
  cursor: pointer;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 5px;
}

.algorithm-box {
  background-color: #fff;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-bottom: 20px;
  line-height: 1.6;
}

.code-block {
  margin: 0;
  white-space: pre-wrap;
  font-size: 0.95rem;
  color: #2c3e50;
  font-family: 'Courier New', Courier, monospace;
}

select {
  padding: 2px 5px;
  font-size: 0.9rem;
  border: 1px solid #999;
  border-radius: 4px;
  background-color: #fff;
  cursor: pointer;
}

.correct {
  background-color: #d4edda !important;
  border-color: #28a745 !important;
}

.incorrect {
  background-color: #f8d7da !important;
  border-color: #dc3545 !important;
}

.actions {
  display: flex;
  gap: 15px;
  justify-content: center;
}

.btn {
  padding: 10px 25px;
  font-weight: bold;
  border: 2px solid #333;
  border-radius: 6px;
  cursor: pointer;
}

.verify-btn {
  background-color: #3498db;
  color: white;
}

.feedback {
  margin-top: 20px;
  padding: 15px;
  border-radius: 6px;
  background: #fff;
  border: 1px solid #ddd;
}

.error-list {
  text-align: left;
  list-style: none;
  padding: 0;
  margin: 10px 0 0 0;
}

.error-list li {
  margin-bottom: 5px;
  font-size: 0.9rem;
}

.success-msg {
  color: #28a745;
  font-weight: bold;
}
.error-msg {
  color: #dc3545;
  font-weight: bold;
}

@media (max-width: 900px) {
  .main-layout {
    flex-direction: column;
  }
}
</style>
