<template>
  <UContainer class="container mx-auto max-w-4xl">
    <h1 class="text-3xl font-bold mb-6">Batch Details: {{ batch.name }}</h1>
    <div v-if="batch" class="space-y-6">
      <UCard>
        <template #header>
          <div class="flex justify-between items-center">
            <h2 class="text-xl font-semibold">Current Stage: {{ getCurrentStageName() }}</h2>
            <UBadge :color="getStatusColor()">{{ batch.status }}</UBadge>
          </div>
        </template>
        <div class="space-y-4">
          <p><strong>Current Day:</strong> {{ batch.currentFermentationDay }}</p>
          <UProgress :value="fermentationProgress" color="primary" class="mb-2" />
          <p>{{ fermentationProgressText }}</p>
          <div class="flex space-x-2">
            <UButton v-for="action in getCurrentStageActions()" :key="action" @click="performAction(action)">
              {{ action }}
            </UButton>
          </div>
        </div>
      </UCard>

      <UCard>
        <template #header>
          <h2 class="text-xl font-semibold">Recipe: {{ batch.recipeName }}</h2>
        </template>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p><strong>Tea Type:</strong> {{ batch.teaType }}</p>
            <p><strong>Sugar:</strong> {{ batch.sugar.amount }}{{ batch.sugar.unit }} ({{ batch.sugar.type }})</p>
            <p><strong>Water:</strong> {{ batch.water.amount }}{{ batch.water.unit }}</p>
            <p><strong>Tea:</strong> {{ batch.tea.amount }}{{ batch.tea.unit }}</p>
            <p><strong>Starter:</strong> {{ batch.starter.amount }}{{ batch.starter.unit }}</p>
            <p><strong>Yield:</strong> {{ batch.yield.amount }}{{ batch.yield.unit }}</p>
          </div>
          <div>
            <h3 class="text-lg font-semibold mb-2">Ingredients:</h3>
            <ul>
              <li v-for="ingredient in batch.ingredients" :key="ingredient.name">
                {{ ingredient.name }}: {{ ingredient.amount }}g
              </li>
            </ul>
          </div>
        </div>
      </UCard>

      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold">Batch Information</h3>
        </template>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p><strong>Start Date:</strong> {{ formatDate(batch.startDate) }}</p>
            <p><strong>First Fermentation Vessel:</strong> {{ batch.f1Vessel }}</p>
            <p><strong>Second Fermentation Vessel:</strong> {{ batch.f2Vessel }}</p>
          </div>
          <div>
            <p><strong>Tracking Temperature:</strong> {{ batch.trackTemperature ? 'Yes' : 'No' }}</p>
            <p><strong>Tracking pH:</strong> {{ batch.trackpH ? 'Yes' : 'No' }}</p>
            <p><strong>Expected F1 End Date:</strong> {{ batch.expected_f1_end_date }}</p>
            <p><strong>Expected F2 End Date:</strong> {{ batch.expected_f2_end_date }}</p>
          </div>
        </div>
      </UCard>

      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold">Notes</h3>
        </template>
        <p>{{ batch.notes }}</p>
      </UCard>
    </div>
    <div v-else>
      <p>Loading batch details...</p>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'nuxt/app'

const route = useRoute()
const router = useRouter()

interface Ingredient {
  name: string;
  amount: number;
}

interface Batch {
  recipeId: number;
  recipeName: string;
  name: string;
  teaType: string;
  sugar: { amount: number; unit: string; type: string };
  ingredients: Ingredient[];
  instructions: {
    brewing: string;
    firstFermentation: string;
    secondFermentation: string;
  };
  fermentation: {
    firstFermentation: { minDays: number; maxDays: number };
    secondFermentation: { minDays: number; maxDays: number };
  };
  water: { amount: number; unit: string };
  tea: { amount: number; unit: string };
  starter: { amount: number; unit: string };
  yield: { amount: number; unit: string };
  startDate: Date;
  status: 'pending' | 'firstFermentation' | 'secondFermentation' | 'bottling' | 'conditioning' | 'ready' | 'completed';
  currentFermentationDay: number;
  notes: string;
  f1Vessel: string;
  f2Vessel: string;
  trackTemperature: boolean;
  trackpH: boolean;
  expected_f1_end_date: string;
  expected_f2_end_date: string;
}

// Mock data (replace with actual data fetching logic)
const batch = ref<Batch>({
  recipeId: 1,
  recipeName: "Classic Kombucha",
  name: "Summer Batch #1",
  teaType: "Black Tea",
  sugar: { amount: 200, unit: "grams", type: "White Sugar" },
  ingredients: [
    { name: "Raspberry", amount: 200 },
    { name: "Mint", amount: 5 },
    { name: "Pineapple", amount: 100 },
  ],
  instructions: {
    brewing: "Brew tea and add sugar",
    firstFermentation: "Cool to room temperature, Add starter tea and SCOBY, Cover and ferment for 7-10 days",
    secondFermentation: "Bottle and add flavoring if desired, Second fermentation for 2-3 days",
  },
  fermentation: {
    firstFermentation: { minDays: 7, maxDays: 10 },
    secondFermentation: { minDays: 2, maxDays: 3 },
  },
  water: { amount: 2000, unit: "ml" },
  tea: { amount: 15, unit: "grams" },
  starter: { amount: 200, unit: "ml" },
  yield: { amount: 2, unit: "liters" },
  startDate: new Date('2023-09-24'),
  status: 'firstFermentation',
  currentFermentationDay: 3,
  notes: 'First attempt at classic kombucha',
  f1Vessel: 'Large Glass Jar',
  f2Vessel: 'Swing Top Bottles',
  trackTemperature: true,
  trackpH: false,
  expected_f1_end_date: '2023-10-01',
  expected_f2_end_date: '2023-10-04',
})


const formatDate = (date: Date): string => {
  return date.toLocaleDateString()
}

const fermentationProgress = computed(() => {
  const totalDays = batch.value.fermentation.firstFermentation.maxDays + batch.value.fermentation.secondFermentation.maxDays
  return (batch.value.currentFermentationDay / totalDays) * 100
})

const fermentationProgressText = computed(() => {
  if (batch.value.status === 'firstFermentation') {
    return `Day ${batch.value.currentFermentationDay} of ${batch.value.fermentation.firstFermentation.maxDays} (First Fermentation)`
  } else if (batch.value.status === 'secondFermentation') {
    const secondFermentationDay = batch.value.currentFermentationDay - batch.value.fermentation.firstFermentation.maxDays
    return `Day ${secondFermentationDay} of ${batch.value.fermentation.secondFermentation.maxDays} (Second Fermentation)`
  } else {
    return 'Fermentation Complete'
  }
})

const getCurrentStageName = () => {
  switch (batch.value.status) {
    case 'pending': return 'Batch Created'
    case 'firstFermentation': return 'First Fermentation (F1)'
    case 'secondFermentation': return 'Second Fermentation (F2)'
    case 'bottling': return 'Bottling'
    case 'conditioning': return 'Bottle Conditioning'
    case 'ready': return 'Ready to Drink'
    case 'completed': return 'Completed'
    default: return 'Unknown'
  }
}

const getStatusColor = () => {
  switch (batch.value.status) {
    case 'pending': return 'gray'
    case 'firstFermentation':
    case 'secondFermentation':
    case 'bottling':
    case 'conditioning': return 'blue'
    case 'ready': return 'green'
    case 'completed': return 'purple'
    default: return 'gray'
  }
}

const getCurrentStageActions = () => {
  switch (batch.value.status) {
    case 'pending':
      return ['Start First Fermentation', 'Edit Batch Details', 'Delete Batch']
    case 'firstFermentation':
      return ['Add Note', 'Add Flavor Profile', 'Add Photo', 'Record Temperature', 'Record pH', 'End F1 / Start F2', 'Discard Batch']
    case 'secondFermentation':
      return ['Add Note', 'Add Flavor Profile', 'Add Photo', 'Record Temperature', 'End F2 / Start Bottling']
    case 'bottling':
      return ['Record Bottling Details', 'Add Note', 'Add Photo', 'Start Bottle Conditioning']
    case 'conditioning':
      return ['Add Note', 'Record Temperature', 'End Conditioning / Mark as Ready']
    case 'ready':
      return ['Add Tasting Notes', 'Rate Final Product', 'Add Photo', 'Mark as Consumed', 'Create New Batch from This Recipe']
    case 'completed':
      return ['View Batch Summary', 'Compare with Other Batches', 'Archive Batch']
    default:
      return []
  }
}

const performAction = (action: string) => {
  // Implement the logic for each action
  console.log(`Performing action: ${action}`)
  // You'll need to implement the actual logic for each action here
}

// Additional actions available at all stages
const commonActions = [
  'View Batch Timeline',
  'View/Edit Recipe Used',
  'Set Reminders',
  'Share Batch Progress'
]
</script>