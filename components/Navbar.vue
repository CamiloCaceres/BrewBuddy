<template>
    <header class="px-4 py-6 dark:bg-gray-900">
      <nav class="flex justify-around items-center">
        <NuxtLink to="/">
          <div class="text-2xl font-bold">KombuchaTrack</div>
        </NuxtLink>
  
  
        <div class="flex gap-4 items-center">
          <UButton v-for="link in links" :to="link.path" class="text-lg font-medium">{{ link.name }}</UButton>
          <DarkModeButton />
        </div>
  
  
      </nav>
    </header>
  </template>
  
  <script setup>  
  
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
  </script>
  