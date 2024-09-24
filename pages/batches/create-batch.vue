<template>
    <UContainer class="p-4 max-w-3xl">
      <h1 class="text-3xl font-bold mb-6">Create New Batch from {{ recipe.name }}</h1>

      <UForm :state="formState" @submit="createBatch" class="space-y-6">
        <UFormGroup label="Start Date" name="startDate">
          <UInput type="date" v-model="formState.startDate" />
        </UFormGroup>
  <!-- TODO:Add view recipe button -->
        <UFormGroup label="Batch Name" name="name">
          <UInput v-model="formState.name" placeholder="Enter a name for this batch" />
        </UFormGroup>
  
        <UFormGroup label="Batch Size" name="batchSize">
          <UInput type="number" v-model="formState.batchSize" :min="0" :step="0.1" />
          <span class="ml-2">{{ recipe.yield.unit }}</span>
        </UFormGroup>
  
        <UFormGroup label="First Fermentation Vessel" name="f1Vessel">
          <UInput v-model="formState.f1Vessel" placeholder="Enter the vessel used for first fermentation" />
        </UFormGroup>
  
        <UFormGroup label="Second Fermentation Vessel" name="f2Vessel">
          <UInput v-model="formState.f2Vessel" placeholder="Enter the vessel used for second fermentation" />
        </UFormGroup>
  
        <UFormGroup label="Track Temperature" name="trackTemperature">
          <UCheckbox v-model="formState.trackTemperature" label="Track temperature during fermentation" />
        </UFormGroup>
  
        <UFormGroup label="Track pH" name="trackpH">
          <UCheckbox v-model="formState.trackpH" label="Track pH during fermentation" />
        </UFormGroup>
  
        <UFormGroup label="Additional Notes" name="notes">
          <UTextarea v-model="formState.notes" placeholder="Enter any additional notes for this batch" />
        </UFormGroup>
  
        <div class="mb-4">
          <h2 class="text-xl font-semibold mb-2">Fermentation Timeline</h2>
          <p>First Fermentation End Date: {{ expected_f1_end_date }}</p>
          <p>Second Fermentation End Date: {{ expected_f2_end_date }}</p>
        </div>
  
        <UButton type="submit">Create Batch</UButton>
      </UForm>
    </UContainer>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, reactive } from 'vue'
  import { useRouter } from 'nuxt/app'
  
  const router = useRouter()
  
  // Assuming you're passing the recipe as a prop or getting it from a store
  const recipe = ref({
    id: 1,
    name: "Classic Kombucha",
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
    flavorProfile: {
      sweetness: 8,
      acidity: 6,
      bitterness: 3,
      carbonation: 9,
    },
  })
  
  const formState = reactive({
    startDate: '',
    name: '',
    batchSize: recipe.value.yield.amount,
    f1Vessel: '',
    f2Vessel: '',
    trackTemperature: false,
    trackpH: false,
    notes: '',
  })
  
  const expected_f1_end_date = computed(() => {
    if (!formState.startDate) return 'Not set'
    const startDate = new Date(formState.startDate)
    const endDate = new Date(startDate.getTime() + recipe.value.fermentation.firstFermentation.maxDays * 24 * 60 * 60 * 1000)
    return endDate.toLocaleDateString()
  })
  
  const expected_f2_end_date = computed(() => {
    if (!formState.startDate) return 'Not set'
    const startDate = new Date(formState.startDate)
    const f1Days = recipe.value.fermentation.firstFermentation.maxDays
    const f2Days = recipe.value.fermentation.secondFermentation.maxDays
    const endDate = new Date(startDate.getTime() + (f1Days + f2Days) * 24 * 60 * 60 * 1000)
    return endDate.toLocaleDateString()
  })
  
  const createBatch = () => {
    // Create a new batch object
    const newBatch = {
      recipeId: recipe.value.id,
      recipeName: recipe.value.name,
      teaType: recipe.value.teaType,
      sugar: recipe.value.sugar,
      ingredients: recipe.value.ingredients,
      instructions: recipe.value.instructions,
      fermentation: recipe.value.fermentation,
      water: recipe.value.water,
      tea: recipe.value.tea,
      starter: recipe.value.starter,
      yield: { amount: formState.batchSize, unit: recipe.value.yield.unit },
      startDate: new Date(formState.startDate),
      status: 'brewing',
      currentFermentationDay: 0,
      notes: formState.notes,
      name: formState.name,
      f1Vessel: formState.f1Vessel,
      f2Vessel: formState.f2Vessel,
      trackTemperature: formState.trackTemperature,
      trackpH: formState.trackpH,
      expected_f1_end_date: expected_f1_end_date.value,
      expected_f2_end_date: expected_f2_end_date.value,
    }
  
    // Here you would typically save the new batch to your state management system or API
    console.log('New batch created:', newBatch)
  
    // Navigate to the batch view page
    router.push(`/batch/${newBatch.recipeId}`)
  }
  </script>