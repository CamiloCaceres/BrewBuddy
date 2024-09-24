<template>
    <div class="container mx-auto p-6 max-w-2xl">
      <h1 class="text-3xl font-bold mb-6">Fermentation Batch Details</h1>
      <div class="space-y-6">
        <UCard>
          <template #header>
            <h2 class="text-xl font-semibold">Start Date</h2>
          </template>
          <p>{{ format(batch.start_date, 'PPP') }}</p>
        </UCard>

        <UCard>
          <template #header>
            <h2 class="text-xl font-semibold">Ingredients</h2>
          </template>
          <ul class="list-disc pl-5">
            <li v-for="(ingredient, index) in batch.ingredients" :key="index">
              {{ ingredient }}
            </li>
          </ul>
        </UCard>

        <UCard>
          <template #header>
            <h2 class="text-xl font-semibold">Duration</h2>
          </template>
          <p>{{ batch.duration }} days</p>
        </UCard>

        <UCard>
          <template #header>
            <h2 class="text-xl font-semibold">Notes</h2>
          </template>
          <p class="whitespace-pre-wrap">{{ batch.notes }}</p>
        </UCard>

        <UCard>
          <template #header>
            <h2 class="text-xl font-semibold">Status</h2>
          </template>
          <UBadge :color="getBadgeColor()">
            {{ getBatchStatus() }}
          </UBadge>
        </UCard>
      </div>
      <div class="mt-8 space-x-4">
        <UButton @click="editBatch">Edit Batch</UButton>
        <UButton color="red" @click="deleteBatch">Delete Batch</UButton>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { computed } from 'vue'
  import { format, addDays, isAfter } from 'date-fns'
  
  // This would typically come from your state management or API
  const batch = {
    id: '1',
    start_date: new Date('2023-09-01'),
    ingredients: ['Cabbage', 'Salt', 'Caraway seeds'],
    duration: 14,
    notes: 'First attempt at sauerkraut. Using 2% salt by weight.',
    user: 'user123'
  }
  
  const getBatchStatus = () => {
    const endDate = addDays(batch.start_date, batch.duration)
    return isAfter(new Date(), endDate) ? 'Completed' : 'In Progress'
  }
  
  const getBadgeColor = () => {
    return getBatchStatus() === 'Completed' ? 'green' : 'blue'
  }
  
  const editBatch = () => {
    // Navigate to edit page or open edit modal
    console.log('Edit batch')
  }
  
  const deleteBatch = () => {
    // Show confirmation dialog and delete if confirmed
    console.log('Delete batch')
  }
  </script>