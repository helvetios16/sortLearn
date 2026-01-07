<script setup lang="ts">
import { RouterLink } from 'vue-router';
import {
  BeakerIcon,
  ChartBarIcon,
  AcademicCapIcon,
  PuzzlePieceIcon,
} from '@heroicons/vue/24/outline';

const features = [
  {
    name: 'Visualizar',
    description:
      'Observa cómo funcionan los algoritmos de ordenamiento paso a paso con animaciones claras.',
    icon: BeakerIcon,
    path: '/visualize',
  },
  {
    name: 'Comparar',
    description:
      'Compara el rendimiento de diferentes algoritmos uno al lado del otro en tiempo real.',
    icon: ChartBarIcon,
    path: '/compare',
  },
  {
    name: 'Aprender',
    description:
      'Aprende los conceptos clave detrás de cada algoritmo con explicaciones sencillas.',
    icon: AcademicCapIcon,
    path: '/learn',
  },
  {
    name: 'Practicar',
    description:
      'Pon a prueba tus conocimientos con ejercicios interactivos y refuerza tu aprendizaje.',
    icon: PuzzlePieceIcon,
    path: '/test',
  },
];
</script>

<template>
  <div class="bg-gray-50">
    <!-- Hero Section -->
    <div class="relative overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-br from-purple-50 via-white to-pink-50"></div>
      <div class="relative container mx-auto px-4 py-20 lg:py-32 text-center">
        <h1
          class="text-4xl lg:text-6xl font-extrabold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-500"
        >
          Aprende Algoritmos de Ordenamiento de Forma Interactiva
        </h1>
        <p class="max-w-2xl mx-auto text-lg lg:text-xl text-slate-600 mb-8">
          Visualiza, compara y practica los algoritmos de ordenamiento más populares para fortalecer
          tus habilidades de una manera divertida y efectiva.
        </p>
        <RouterLink
          to="/visualize"
          class="inline-block bg-purple-600 text-white font-bold text-lg px-8 py-3 rounded-full shadow-lg hover:bg-purple-700 transition-transform transform hover:scale-105"
        >
          Empezar a Visualizar
        </RouterLink>
      </div>
    </div>

    <!-- Features Section -->
    <div class="py-16 lg:py-24 bg-white">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-3xl lg:text-4xl font-bold text-gray-800">Características Principales</h2>
          <p class="max-w-xl mx-auto text-slate-500 mt-2">
            Todo lo que necesitas para dominar los algoritmos de ordenamiento en un solo lugar.
          </p>
        </div>
        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div
            v-for="feature in features"
            :key="feature.name"
            class="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center hover:shadow-lg transition-shadow"
          >
            <div
              class="mx-auto w-16 h-16 mb-4 rounded-full flex items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100"
            >
              <component
                :is="feature.icon"
                class="w-8 h-8 text-purple-600"
              />
            </div>
            <h3 class="text-xl font-bold text-gray-800 mb-2">{{ feature.name }}</h3>
            <p class="text-slate-500 mb-4">{{ feature.description }}</p>
            <RouterLink
              :to="feature.path"
              class="font-semibold text-purple-600 hover:text-purple-800 transition-colors"
            >
              Ir a {{ feature.name }} &rarr;
            </RouterLink>
          </div>
        </div>
      </div>
    </div>

    <!-- CTA Section -->
    <div class="bg-gray-50">
      <div class="container mx-auto px-4 py-16 text-center">
        <h2 class="text-3xl font-bold text-gray-800 mb-4">¿Listo para empezar?</h2>
        <p class="max-w-md mx-auto text-slate-600 mb-8">
          Sumérgete en el mundo de los algoritmos y lleva tus habilidades al siguiente nivel.
        </p>
        <div class="flex justify-center gap-4">
          <RouterLink
            to="/learn"
            class="bg-white border border-gray-300 text-gray-800 font-bold px-6 py-3 rounded-full hover:bg-gray-100 transition-colors"
          >
            Ver la Teoría
          </RouterLink>
          <RouterLink
            to="/test"
            class="bg-purple-600 text-white font-bold px-6 py-3 rounded-full hover:bg-purple-700 transition-colors"
          >
            Practicar Ahora
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>
