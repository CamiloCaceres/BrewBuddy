<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-6">Create a New Batch</h1>
    
    <div class="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 class="text-xl font-semibold mb-4">What is a Batch?</h2>
      <p class="text-gray-700 mb-4">
        A batch is a specific instance of a recipe that you're planning to brew. It allows you to track the brewing process, make adjustments, and record the results of your brew day.
      </p>
    </div>

    <div class="bg-white rounded-lg shadow-md p-6">
      <h2 class="text-xl font-semibold mb-4">Choose Your Starting Point</h2>
      <p class="text-gray-700 mb-6">
        To create a new batch, you can either start from an existing recipe or browse our collection of standard recipes.
      </p>
      
      <div class="flex flex-row gap-4">
        <UButton
          to="/recipes"
          color="primary"
          variant="outline"
          class="flex-1 text-center py-3"
          icon="i-heroicons-book-open"
        >
          Browse Recipes
        </UButton>
        <UButton
          to="/batches/create/93a89lu2cwzgzpm"
          color="primary"
          class="flex-1 text-center py-3"
          icon="i-heroicons-beaker"
        >
          Use Standard Recipe
        </UButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// No additional setup needed for now
</script>

