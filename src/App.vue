<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
</script>

<template>
  <header class="bg-white shadow-md">
    <div class="container mx-auto px-4">
      <nav class="flex items-center justify-center space-x-4 h-16">
        <RouterLink
          to="/"
          class="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
          active-class="bg-purple-100 text-purple-700"
          >Inicio</RouterLink
        >

        <RouterLink
          to="/visualize"
          class="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
          active-class="bg-purple-100 text-purple-700"
          >Aprender</RouterLink
        >

        <RouterLink
          to="/test"
          class="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
          active-class="bg-purple-100 text-purple-700"
          >Practicar</RouterLink
        >

        <RouterLink
          to="/learn"
          class="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
          active-class="bg-purple-100 text-purple-700"
          >Implementación</RouterLink
        >
      </nav>
    </div>
  </header>

  <main class="container mx-auto p-4">
    <RouterView />
  </main>
</template>
