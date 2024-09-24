<template>
    <UContainer class="py-8 max-w-4xl">
      <UCard>
        <template #header>
            <div class="flex justify-between">
                <div>

                    <h1 class="text-3xl font-bold text-gray-900">{{ recipe.name }}</h1>
                    <p class="mt-1 text-sm text-gray-500">{{ recipe.teaType }}</p>
                </div>
                <UButton square variant="ghost" size="lg" icon="heroicons-bookmark" color="yellow" />
            </div>
        </template>
        <UFormGroup label="Measurement Unit" class="mb-4">
          <USelectMenu
            v-model="measurementUnit"
            :options="measurementUnits"
            placeholder="Select a measurement unit"
          />
        </UFormGroup>
        <UTable :columns="columns" :rows="recipeDetails" />
        <UDivider />
        <div class="space-y-4">
          <div>
            <h2 class="text-lg font-semibold my-4">Fermentations</h2>
            <p class="text-sm text-gray-600 p-1"> <span class="font-semibold text-md">F1:</span> {{ recipe.fermentation1Days }} days</p>
            <p class="text-sm text-gray-600 p-1"> <span class="font-semibold text-md">F2:</span> {{ recipe.fermentation2Days }} days</p>
          </div>
          <div>
            <h2 class="text-lg font-semibold mb-2">Notes</h2>
            <p class="text-sm text-gray-600 p-1">{{ recipe.notes }}</p>
          </div>
        </div>
        <template #footer>
            <div class="flex justify-end">
                <UButton>Create Batch</UButton>
            </div>
        </template>
      </UCard>
    </UContainer>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue'
  
  // Dummy data (now all in grams)
  const recipe = ref({
    name: 'Classic Kombucha',
    teaType: 'Black Tea',
    sugar_amount: 200,
    ingredients: [
        { name: 'Raspberry', amount: 200 },
        { name: 'Mint', amount: 5 },
        { name: 'Pineapple', amount: 100 },
    ],
    notes: 'Brew tea and add sugar, Cool to room temperature, Add starter tea and SCOBY, Cover and ferment for 7-10 days, Bottle and add flavoring if desired, Second fermentation for 2-3 days',
    fermentation1Days: 7,
    fermentation2Days: 3,
    water_amount: 2000, // 2 liters = 2000 grams
    tea_amount: 15,
    starter_amount: 200,
  })
  
  const measurementUnit = ref("grams");
  const measurementUnits = ["cups", "liters", "grams", "ounces"];
  
  // Conversion factors
  const conversionFactors = {
    cups: { liters: 0.236588, grams: 236.588, ounces: 8 },
    liters: { cups: 4.22675, grams: 1000, ounces: 33.814 },
    grams: { cups: 0.00422675, liters: 0.001, ounces: 0.03527396 },
    ounces: { cups: 0.125, liters: 0.0295735, grams: 28.3495 },
  };
  
  function convertUnit(value, fromUnit, toUnit) {
    if (fromUnit === toUnit) return value;
    if (conversionFactors[fromUnit] && conversionFactors[fromUnit][toUnit]) {
      return value * conversionFactors[fromUnit][toUnit];
    }
    throw new Error(`Invalid unit conversion from ${fromUnit} to ${toUnit}`);
  }
  
  const columns = [
    { key: 'label', label: 'Ingredient' },
    { key: 'value', label: 'Amount' }
  ]
  
  const recipeDetails = computed(() => {
    const convertedWaterAmount = convertUnit(recipe.value.water_amount, 'grams', measurementUnit.value);
    const convertedTeaAmount = convertUnit(recipe.value.tea_amount, 'grams', measurementUnit.value);
    const convertedSugarAmount = convertUnit(recipe.value.sugar_amount, 'grams', measurementUnit.value);
    const convertedStarterAmount = convertUnit(recipe.value.starter_amount, 'grams', measurementUnit.value);
    const convertedIngredients = recipe.value.ingredients.map(ingredient => {
      const convertedAmount = convertUnit(ingredient.amount, 'grams', measurementUnit.value);
      return { label: ingredient.name, value: `${convertedAmount.toFixed(2)} ${measurementUnit.value}` };
    });
  
    return [
      { label: 'Tea Amount', value: `${convertedTeaAmount.toFixed(2)} ${measurementUnit.value}` },
      { label: 'Water Amount', value: `${convertedWaterAmount.toFixed(2)} ${measurementUnit.value}` },
      { label: 'Sugar Amount', value: `${convertedSugarAmount.toFixed(2)} ${measurementUnit.value}` },
      { label: 'Starter Amount', value: `${convertedStarterAmount.toFixed(2)} ${measurementUnit.value}` },
      ...convertedIngredients,
    ]
  })
  </script>