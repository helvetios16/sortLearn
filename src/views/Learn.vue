
Actualizar

Colaborar

Compartir
// puedes hacer que en el cuadro izquierdo , en el ejemplo no tenga fondo negro sino blanco por favor y otra cosa mas , que todos lo ejemplos esten en el lenguaje c++ // ademas de que en el for y en doble for , puedes poner como imprime o que imprime por favor tambien en el if un ejemplo  y que imprime segun la condicion por favor
pasted_content.txt
Texto · 10.57 KB
Lite
¡Entendido! Modificaré el formato de los cuadros, cambiaré todos los ejemplos a C++ e incluiré las explicaciones detalladas sobre las impresiones y condiciones que solicitaste. Permíteme preparar el documento actualizado.
Voy a modificar el documento para cambiar el fondo del cuadro izquierdo a blanco, convertir todos los ejemplos a C++, y agregar explicaciones detalladas de impresión y condiciones en bucles y ifs.

Analicé el contenido actual, que incluye ejemplos en varios lenguajes y la interfaz para modificar ejemplos a C++. Modificaré el fondo del panel izquierdo a blanco, convertiré todos los ejemplos a C++, y agregaré explicaciones detalladas de impresión, bucles y condiciones.

He modificado el documento para que el fondo del panel izquierdo sea blanco, convertí todos los ejemplos a C++ y agregaré explicaciones detalladas sobre impresión, bucles y condicionales.

Lite
He actualizado el documento siguiendo todas tus indicaciones. Aquí tienes un resumen de los cambios realizados:
Fondo Blanco: Se ha modificado el estilo del cuadro izquierdo para que los ejemplos de código tengan un fondo blanco con texto oscuro, mejorando la legibilidad según lo solicitado.
Lenguaje C++: Se han eliminado las referencias a otros lenguajes (Python/Java) y ahora todos los ejemplos de referencia y el ejercicio principal están exclusivamente en C++.
Ejemplos Detallados:
Bucle For: Incluye un ejemplo que imprime iteraciones del 0 al 2.
Doble For: Muestra cómo se imprimen las coordenadas i y j en una estructura anidada.
Sentencia If: Incluye una condición de mayoría de edad con la explicación de por qué se imprime el resultado.
Puedes encontrar el código completo en el archivo adjunto.
pasted_content_updated.txt
Texto · 7.36 KB

Ver todos los archivos en esta tarea
no que hiciste solo te pide que el cuadro izquierdo sean todo ejemplos en c++ , el lado derecho no , vuelvelo como esta antes el cuadro derecho
Lite
¡Mil disculpas por el error! Entiendo perfectamente: solo el panel de ejemplos (izquierdo) debe ser exclusivamente en C++ y con fondo blanco, mientras que el panel del ejercicio (derecho) debe mantener su funcionalidad original con los tres lenguajes (C++, Python y Java). Voy a restaurar el panel derecho de inmediato.
Confirmé que el panel izquierdo ahora solo tiene ejemplos en C++ con fondo blanco y los detalles de impresión, bucles y condicionales. Restauraré el panel derecho con los tres lenguajes.

He recuperado la estructura original del panel derecho, que incluye tres lenguajes (C++, Python, Java). Mantendré el panel izquierdo solo con ejemplos en C++. Próximo paso: integrar los ejemplos completos en el panel derecho.

Restauré la estructura original del panel derecho con los tres lenguajes y combiné el panel izquierdo en C++ con fondo blanco, listo para entregar.

Lite
He corregido el documento para que se ajuste exactamente a lo que necesitas:
Panel Izquierdo (Ejemplos):
Solo C++: Se han eliminado los otros lenguajes.
Fondo Blanco: El cuadro de código ahora tiene fondo blanco y texto oscuro.
Detalles de Impresión: Se incluyeron comentarios explicativos sobre qué imprime cada ejemplo (for, if, doble for).
Panel Derecho (Ejercicio):
Restaurado: He vuelto a incluir las opciones para C++, Python y Java, manteniendo la funcionalidad original del ejercicio de Selection Sort.
Siento la confusión anterior, aquí tienes la versión final corregida.
pasted_content_final.txt
Texto · 10.96 KB

Ver todos los archivos en esta tarea
Tarea completada
¿Cómo fue este resultado?
Seguimientos sugeridos
Enviar mensaje a Manus

pasted_content_final.txt
<template>
  <div class="main-layout">
    <!-- Panel Izquierdo: Ejemplos (SOLO C++ y FONDO BLANCO) -->
    <div class="examples-panel">
      <h3>Ejemplos de Referencia (C++)</h3>
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
        <!-- Ejemplo FOR -->
        <div v-if="selectedExample === 'for'">
          <p><strong>Bucle For:</strong> Repite un bloque de código un número determinado de veces.</p>
          <pre class="example-code">
for (int i = 0; i < 3; i++) {
    cout << "Iteracion: " << i << endl;
}

/* 
Salida (Lo que imprime):
Iteracion: 0
Iteracion: 1
Iteracion: 2
*/</pre>
        </div>

        <!-- Ejemplo IF -->
        <div v-else-if="selectedExample === 'if'">
          <p><strong>Sentencia If:</strong> Evalúa una condición y ejecuta el código si es verdadera.</p>
          <pre class="example-code">
int edad = 18;
if (edad >= 18) {
    cout << "Es mayor de edad" << endl;
} else {
    cout << "Es menor de edad" << endl;
}

/* 
Salida (Lo que imprime):
Es mayor de edad
(Porque 18 >= 18 es verdadero)
*/</pre>
        </div>

        <!-- Ejemplo DOBLE FOR -->
        <div v-else-if="selectedExample === 'nestedFor'">
          <p>
            <strong>For anidado:</strong> Es un doble <code>for</code>, donde un bucle se encuentra dentro de otro.
            El bucle externo controla las repeticiones principales y, por cada vuelta que da,
            el bucle interno se ejecuta completamente desde el inicio hasta su final.
          </p>

          <pre class="example-code">
for (int i = 0; i < 2; i++) {
    for (int j = 0; j < 2; j++) {
        cout << "i=" << i << ", j=" << j << " | ";
    }
    cout << endl;
}

/* 
Salida (Lo que imprime):
i=0, j=0 | i=0, j=1 | 
i=1, j=0 | i=1, j=1 | 
*/</pre>
        </div>
      </div>
    </div>

    <!-- Panel Derecho: Ejercicio Actual (RESTAURADO MULTI-LENGUAJE) -->
    <div class="selection-sort-container">
      <!-- Selector de Lenguaje -->
      <div class="language-selector">
        <label v-for="lang in ['cpp', 'python', 'java']" :key="lang" class="lang-option">
          <input type="radio" v-model="selectedLanguage" :value="lang">
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
        <p v-if="allCorrect" class="success-msg">¡Correcto! Has completado el algoritmo correctamente.</p>
        <p v-else class="error-msg">Algunas respuestas son incorrectas. Inténtalo de nuevo.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';

type Language = 'cpp' | 'python' | 'java';
type GapKey = 'gap1' | 'gap2' | 'gap3';

const selectedLanguage = ref<Language>('cpp');
const selectedExample = ref('for');

const options = {
  gap1: ['n', 'n - 1', 'n + 1'],
  gap2: ['i', 'i + 1', '0'],
  gap3: ['a[minIndex]', 'a[i]', 'a[j]']
};

const correctAnswers = {
  gap1: 'n - 1',
  gap2: 'i + 1',
  gap3: 'a[minIndex]'
};

const answers = reactive({
  cpp: { gap1: '', gap2: '', gap3: '' },
  python: { gap1: '', gap2: '', gap3: '' },
  java: { gap1: '', gap2: '', gap3: '' }
});

const verified = reactive({
  cpp: false,
  python: false,
  java: false
});

const isCorrect = (lang: Language, gap: GapKey) => {
  return answers[lang][gap] === correctAnswers[gap];
};

const onChangeAnswer = (lang: Language) => {
  verified[lang] = false;
};

const allCorrect = computed(() => {
  const lang = selectedLanguage.value;
  return (Object.keys(correctAnswers) as GapKey[]).every(key => isCorrect(lang, key));
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
.main-layout {
  display: flex;
  gap: 20px;
  max-width: 1200px;
  margin: 2rem auto;
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* Panel Izquierdo: Ejemplos (Fondo Blanco) */
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
  background: #fff; /* Fondo blanco solicitado */
  padding: 15px;
  border-radius: 6px;
  border: 1px solid #eee;
}

.example-code {
  background: #ffffff; /* Fondo blanco para el código */
  color: #2c3e50;    /* Texto oscuro para contraste */
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow-x: auto;
  font-family: 'Courier New', Courier, monospace;
  font-size: 0.9rem;
  margin-top: 10px;
  line-height: 1.4;
}

/* Panel Derecho: Ejercicio (Original) */
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
  background: #eee;
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
  font-size: 1rem;
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
  text-align: center;
  font-weight: bold;
}

.success-msg { color: #28a745; }
.error-msg { color: #dc3545; }

@media (max-width: 900px) {
  .main-layout {
    flex-direction: column;
  }
}
</style>
