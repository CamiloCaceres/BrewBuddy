<template>
  <UContainer class="py-8 max-w-4xl">
    <UCard>
      <template #header>
        <div class="flex justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100">{{ recipe.name }}</h1>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">{{ recipe.teaType }}</p>
          </div>
          <UButton
            square
            variant="ghost"
            size="lg"
            icon="heroicons-bookmark"
            color="yellow"
          />
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
          <h2 class="text-lg font-semibold my-4 dark:text-gray-200">Fermentations</h2>
          <p class="text-sm text-gray-600 dark:text-gray-300 p-1">
            <span class="font-semibold text-md">F1:</span>
            {{ recipe.fermentation.firstFermentation.minDays }} - {{ recipe.fermentation.firstFermentation.maxDays }} days
          </p>
          <p class="text-sm text-gray-600 dark:text-gray-300 p-1">
            <span class="font-semibold text-md">F2:</span>
            {{ recipe.fermentation.secondFermentation.minDays }} - {{ recipe.fermentation.secondFermentation.maxDays }} days
          </p>
        </div>
        <div>
          <h3 class="text-lg font-semibold mb-2 dark:text-gray-200">Instructions</h3>
          <p class="text-sm text-gray-600 dark:text-gray-300 p-1"><strong>Brewing:</strong> {{ recipe.instructions.brewing }}</p>
          <p class="text-sm text-gray-600 dark:text-gray-300 p-1"><strong>First Fermentation:</strong> {{ recipe.instructions.firstFermentation }}</p>
          <p class="text-sm text-gray-600 dark:text-gray-300 p-1"><strong>Second Fermentation:</strong> {{ recipe.instructions.secondFermentation }}</p>
          <h3 class="text-lg font-semibold mt-4 mb-2 dark:text-gray-200">Flavor Profile:</h3>
          <div class="flex flex-row gap-4">
            <UMeter :value="recipe.flavorProfile.sweetness" :max="10" label="Sweetness" />
            <UMeter :value="recipe.flavorProfile.acidity" :max="10" label="Acidity" />
            <UMeter :value="recipe.flavorProfile.bitterness" :max="10" label="Bitterness" />
            <UMeter :value="recipe.flavorProfile.carbonation" :max="10" label="Carbonation" />  
          </div>
        </div>
        <div>
          <h3 class="text-lg font-semibold mb-2 dark:text-gray-200">Additional Information</h3>
          <p class="text-sm text-gray-600 dark:text-gray-300 p-1"><strong>Difficulty:</strong> {{ recipe.difficulty }}</p>
          <p class="text-sm text-gray-600 dark:text-gray-300 p-1"><strong>Yield:</strong> {{ recipe.yield.amount }} {{ recipe.yield.unit }}</p>
          <p class="text-sm text-gray-600 dark:text-gray-300 p-1"><strong>Tags:</strong> {{ recipe.tags.join(", ") }}</p>
          <p class="text-sm text-gray-600 dark:text-gray-300 p-1"><strong>Author:</strong> {{ recipe.author }}</p>
          <p class="text-sm text-gray-600 dark:text-gray-300 p-1"><strong>Rating:</strong> {{ recipe.ratings.averageRating.toFixed(1) }} ({{ recipe.ratings.numberOfRatings }} ratings)</p>
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
import { reactive, ref, computed } from "vue";

// Updated recipe object
const recipe = reactive({
  id: 1,
  name: "Classic Kombucha",
  description: "A refreshing and tangy classic kombucha recipe",
  teaType: "Black Tea",
  sugar: { amount: 200, unit: "grams", type: "White Sugar" },
  ingredients: [
    { name: "Raspberry", amount: 200, unit: "grams" },
    { name: "Mint", amount: 5, unit: "grams" },
    { name: "Pineapple", amount: 100, unit: "grams" },
  ],
  instructions: {
    brewing: "Brew tea and add sugar. Cool to room temperature.",
    firstFermentation: "Add starter tea and SCOBY. Cover and ferment for 7-10 days.",
    secondFermentation: "Bottle and add flavoring if desired. Ferment for 2-3 days.",
  },
  fermentation: {
    firstFermentation: { minDays: 7, maxDays: 10 },
    secondFermentation: { minDays: 2, maxDays: 3 },
  },
  water: { amount: 2000, unit: "ml" },
  tea: { amount: 15, unit: "grams" },
  starter: { amount: 200, unit: "ml" },
  flavorProfile: {
    sweetness: 8,
    acidity: 6,
    bitterness: 3,
    carbonation: 9,
  },
  difficulty: "Intermediate",
  yield: { amount: 2, unit: "liters" },
  tags: ["kombucha", "probiotic", "fermented"],
  createdAt: new Date(),
  updatedAt: new Date(),
  ratings: { averageRating: 4.5, numberOfRatings: 10 },
  author: "Kombucha Master",
  isPublic: true,
});

const measurementUnit = ref("grams");
const measurementUnits = ["cups", "liters", "grams", "ounces", "ml"];

// Conversion factors
const conversionFactors = {
  cups: { liters: 0.236588, grams: 236.588, ounces: 8, ml: 236.588 },
  liters: { cups: 4.22675, grams: 1000, ounces: 33.814, ml: 1000 },
  grams: { cups: 0.00422675, liters: 0.001, ounces: 0.03527396, ml: 1 },
  ounces: { cups: 0.125, liters: 0.0295735, grams: 28.3495, ml: 29.5735 },
  ml: { cups: 0.00422675, liters: 0.001, grams: 1, ounces: 0.033814 },
};

function convertUnit(value, fromUnit, toUnit) {
  if (fromUnit === toUnit) return value;
  if (conversionFactors[fromUnit] && conversionFactors[fromUnit][toUnit]) {
    return value * conversionFactors[fromUnit][toUnit];
  }
  throw new Error(`Invalid unit conversion from ${fromUnit} to ${toUnit}`);
}

const columns = [
  { key: "label", label: "Ingredient" },
  { key: "value", label: "Amount" },
];

const recipeDetails = computed(() => {
  const convertedWaterAmount = convertUnit(
    recipe.water.amount,
    recipe.water.unit,
    measurementUnit.value
  );
  const convertedTeaAmount = convertUnit(
    recipe.tea.amount,
    recipe.tea.unit,
    measurementUnit.value
  );
  const convertedSugarAmount = convertUnit(
    recipe.sugar.amount,
    recipe.sugar.unit,
    measurementUnit.value
  );
  const convertedStarterAmount = convertUnit(
    recipe.starter.amount,
    recipe.starter.unit,
    measurementUnit.value
  );
  const convertedIngredients = recipe.ingredients.map((ingredient) => {
    const convertedAmount = convertUnit(
      ingredient.amount,
      ingredient.unit,
      measurementUnit.value
    );
    return {
      label: ingredient.name,
      value: `${convertedAmount.toFixed(2)} ${measurementUnit.value}`,
    };
  });

  return [
    {
      label: "Tea Amount",
      value: `${convertedTeaAmount.toFixed(2)} ${measurementUnit.value}`,
    },
    {
      label: "Water Amount",
      value: `${convertedWaterAmount.toFixed(2)} ${measurementUnit.value}`,
    },
    {
      label: "Sugar Amount",
      value: `${convertedSugarAmount.toFixed(2)} ${measurementUnit.value} (${recipe.sugar.type})`,
    },
    {
      label: "Starter Amount",
      value: `${convertedStarterAmount.toFixed(2)} ${measurementUnit.value}`,
    },
    ...convertedIngredients,
  ];
});
</script>