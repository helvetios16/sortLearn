<script setup lang="ts">
import { RouterLink } from 'vue-router';

const algorithms = [
  {
    name: 'Selection Sort',
    description: 'Encuentra el mínimo y colócalo en su posición',
    available: true,
    path: '/visualize',
  },
  {
    name: 'Bubble Sort',
    description: 'Compara elementos adyacentes y los intercambia',
    available: false,
    path: '#',
  },
  {
    name: 'Insertion Sort',
    description: 'Inserta cada elemento en su posición correcta',
    available: false,
    path: '#',
  },
  {
    name: 'Merge Sort',
    description: 'Divide y conquista para ordenar eficientemente',
    available: false,
    path: '#',
  },
];
</script>

<template>
  <div
    class="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center px-4"
  >
    <div class="max-w-4xl w-full text-center">
      <!-- Hero Title -->
      <h1
        class="text-4xl lg:text-6xl font-extrabold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-500"
      >
        Aprende Algoritmos de Ordenamiento
      </h1>
      <p class="text-lg lg:text-xl text-slate-600 mb-12 max-w-2xl mx-auto">
        Aprende, practica e implementa algoritmos de ordenamiento de forma interactiva
      </p>

      <!-- Algorithms Grid -->
      <div class="grid md:grid-cols-2 gap-6 mb-8">
        <div
          v-for="algo in algorithms"
          :key="algo.name"
          class="relative bg-white rounded-2xl shadow-sm border-2 p-6 text-left transition-all"
          :class="
            algo.available
              ? 'border-purple-200 hover:shadow-lg hover:border-purple-300'
              : 'border-gray-200 opacity-60'
          "
        >
          <!-- Available Badge -->
          <div
            v-if="algo.available"
            class="absolute -top-3 -right-3 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md"
          >
            Disponible
          </div>

          <!-- Coming Soon Badge -->
          <div
            v-else
            class="absolute -top-3 -right-3 bg-gray-400 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md"
          >
            Próximamente
          </div>

          <h3 class="text-2xl font-bold text-gray-800 mb-2">{{ algo.name }}</h3>
          <p class="text-slate-600 mb-4">{{ algo.description }}</p>

          <RouterLink
            v-if="algo.available"
            :to="algo.path"
            class="inline-block bg-purple-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Comenzar →
          </RouterLink>
          <button
            v-else
            disabled
            class="inline-block bg-gray-300 text-gray-500 font-semibold px-6 py-2 rounded-lg cursor-not-allowed"
          >
            En construcción
          </button>
        </div>
      </div>

      <!-- Footer Note -->
      <p class="text-sm text-slate-500 italic">
        💡 Más algoritmos estarán disponibles próximamente
      </p>
    </div>
  </div>
</template>
