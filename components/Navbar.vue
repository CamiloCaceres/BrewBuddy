<template>
  <header class="px-4 py-6 dark:bg-gray-900 shadow-md">
    <nav class="container mx-auto flex justify-between items-center">
      <NuxtLink to="/" class="text-2xl font-bold">KombuchaTrack</NuxtLink>

      <!-- Desktop Menu -->
      <div class="hidden md:flex gap-4 items-center">
        <UButton
          v-for="link in links"
          :key="link.path"
          variant="link"
          :to="link.path"
          class="text-lg font-medium"
        >
          {{ link.name }}
        </UButton>
        <DarkModeButton />
      </div>

      <!-- Mobile Menu Button -->
      <UButton
        @click="isMenuOpen = !isMenuOpen"
        class="md:hidden"
        aria-label="Toggle menu"
      >
        <i class="heroicons-bars-4"></i>
      </UButton>

      <!-- Mobile Menu -->
      <div
        v-if="isMenuOpen"
        class="absolute top-16 left-0 right-0 bg-white dark:bg-gray-800 shadow-md md:hidden z-50 transition-all duration-300 ease-in-out motion-reduce:transition-none motion-reduce:hover:transform-none "
      >
        <div class="flex flex-col p-4 justify-center items-center">
          <UButton
            v-for="link in links"
            :key="link.path"
            variant="link"
            :to="link.path"
            class="text-lg font-medium py-2"
            @click="isMenuOpen = false"
          >
            {{ link.name }}
          </UButton>
          <div class="py-2">
            <DarkModeButton />
          </div>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { ref } from 'vue'

const links = [
  {
    name: 'Login',
    path: '/login',
  },
  {
    name: 'Dashboard',
    path: '/dashboard',
  },
  {
    name: 'Batches',
    path: '/batches',
  },
  {
    name: 'Recipes',
    path: '/recipes',
  },
]

const isMenuOpen = ref(false)
</script>