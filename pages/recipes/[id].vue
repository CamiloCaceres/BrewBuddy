<template>
  <UContainer class="py-8 max-w-4xl">
    <UCard>
      <template #header>
        <div class="flex justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {{ recipe.name }}
            </h1>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {{ recipe.teaType }}
            </p>
          </div>
        </div>
      </template>
      <UFormGroup label="Desired Yield (grams)" class="mb-4">
        <UInput
          v-model.number="desiredYield"
          type="number"
          min="0"
          step="100"
        />
      </UFormGroup>
      <UFormGroup label="Unit" class="mb-4">
        <USelectMenu v-model="selectedUnit" :options="unitOptions" />
      </UFormGroup>
      <h2 class="text-lg font-semibold my-4 dark:text-gray-200">
        Fermentation 1 Ingredients
      </h2>
      <UTable :columns="columns" :rows="recipeDetails" />
      <div v-if="recipe.F2ingredients">

        <h2 class="text-lg font-semibold my-4 dark:text-gray-200">
          Fermentation 2 Ingredients
        </h2>
        <UTable :columns="f2Columns" :rows="f2Ingredients" />
      </div>
      <UDivider />
      <div class="space-y-4">
        <div>
          <h2 class="text-lg font-semibold my-4 dark:text-gray-200">
            Fermentations
          </h2>
          <p class="text-sm text-gray-600 dark:text-gray-300 p-1">
            <span class="font-semibold text-md">F1:</span>
            {{ recipe.F1Days }} days
          </p>
          <p class="text-sm text-gray-600 dark:text-gray-300 p-1">
            <span class="font-semibold text-md">F2:</span>
            {{ recipe.F2Days }} days
          </p>
        </div>
        <div>
          <h3 class="text-lg font-semibold mb-2 dark:text-gray-200">
            Description
          </h3>
          <p class="text-sm text-gray-600 dark:text-gray-300 p-1">
            {{ recipe.description }}
          </p>
        </div>
        <div>
          <h3 class="text-lg font-semibold mt-4 mb-2 dark:text-gray-200">
            Flavor Profile:
          </h3>
          <div v-if="flavorProfile" class="flex flex-row gap-4">
            <UMeter
              :value="flavorProfile.sweetness"
              :max="10"
              label="Sweetness"
            />
            <UMeter :value="flavorProfile.acidity" :max="10" label="Acidity" />
            <UMeter
              :value="flavorProfile.bitterness"
              :max="10"
              label="Bitterness"
            />
            <UMeter
              :value="flavorProfile.carbonation"
              :max="10"
              label="Carbonation"
            />
          </div>
        </div>
        <div>
          <h3 class="text-lg font-semibold mb-2 dark:text-gray-200">
            Additional Information
          </h3>
          <p class="text-sm text-gray-600 dark:text-gray-300 p-1">
            <strong>Author:</strong> {{ recipe.expand?.author.name }}
          </p>
          <p class="text-sm text-gray-600 dark:text-gray-300 p-1">
            <strong>Public:</strong> {{ recipe.isPublic ? "Yes" : "No" }}
          </p>
        </div>
      </div>
    </UCard>
  </UContainer>
</template>

<script setup lang="ts">
import { reactive, ref, computed, onMounted } from "vue";
import { usePocketBase } from "@/composables/usePocketBase";
import type { KombuchaRecipe, Ingredient, FlavorProfile } from "@/types";

const { getRecipeById } = usePocketBase();
const recipe = ref<KombuchaRecipe>({} as KombuchaRecipe);
const flavorProfile = ref<FlavorProfile | null>(null);
const ingredients = ref<Ingredient[]>([]);

const route = useRoute();
const recipeId = route.params.id as string;

onMounted(async () => {
  const fetchedRecipe = await getRecipeById(recipeId);
  // Parse JSON fields
  fetchedRecipe.flavorProfile = fetchedRecipe.flavorProfile;

  fetchedRecipe.ingredients = fetchedRecipe.ingredients;

  // Convert number fields to IngredientWithAmount objects
  fetchedRecipe.sugar = { amount: fetchedRecipe.sugar, unit: "g" };
  fetchedRecipe.water = { amount: fetchedRecipe.water, unit: "g" };
  fetchedRecipe.starter = { amount: fetchedRecipe.starter, unit: "g" };
  fetchedRecipe.tea = { amount: fetchedRecipe.tea, unit: "g" };

  recipe.value = fetchedRecipe as unknown as KombuchaRecipe;
  flavorProfile.value = recipe.value.flavorProfile;
  ingredients.value = recipe.value.F2ingredients;
});

const desiredYield = ref(1000); // Default yield of 1000g
const selectedUnit = ref("g");
const unitOptions = ["g", "kg", "oz", "lb"];

const columns = [
  { key: "label", label: "Ingredient" },
  { key: "amount", label: "Amount" },
  { key: "percentage", label: "Percentage" },
];

const conversionFactors = {
  g: 1,
  kg: 0.001,
  oz: 0.035274,
  lb: 0.00220462,
};

const convertUnit = (value: number, fromUnit: string, toUnit: string) => {
  const gramsValue =
    value / conversionFactors[fromUnit as keyof typeof conversionFactors];
  return (
    gramsValue * conversionFactors[toUnit as keyof typeof conversionFactors]
  );
};

const recipeDetails = computed(() => {
  if (!recipe.value.sugar || !recipe.value.water || !recipe.value.starter)
    return [];

  const waterAmount = desiredYield.value;
  const sugarAmount = (recipe.value.sugar.amount / 100) * waterAmount;
  const starterAmount = (recipe.value.starter.amount / 100) * waterAmount;
  const teaAmount = (recipe.value.tea.amount / 100) * waterAmount;

  return [
    {
      label: "Water",
      amount: formatAmount(waterAmount, "g", selectedUnit.value),
      percentage: "100%",
    },
    {
      label: "Sugar",
      amount: `${formatAmount(sugarAmount, "g", selectedUnit.value)} (${
        recipe.value.sugarType
      })`,
      percentage: `${recipe.value.sugar.amount.toFixed(2)}%`,
    },
    {
      label: "Starter",
      amount: formatAmount(starterAmount, "g", selectedUnit.value),
      percentage: `${recipe.value.starter.amount.toFixed(2)}%`,
    },
    {
      label: `${recipe.value.teaType}`,
      amount: formatAmount(teaAmount, "g", selectedUnit.value),
      percentage: `${recipe.value.tea.amount.toFixed(2)}%`,
    },

  ];
});

const f2Columns = [
  { key: "name", label: "Ingredient" },
  { key: "amount", label: "Amount" },
  { key: "unit", label: "Unit" },
];

const f2Ingredients = computed(() => {
  if (!recipe.value.F2ingredients) return [];

  return recipe.value.F2ingredients.map((ingredient: Ingredient) => ({
    name: ingredient.name,
    amount: formatAmount(
      ingredient.amount,
      ingredient.unit,
      selectedUnit.value
    ),
    unit: selectedUnit.value,
  }));
});

const formatAmount = (amount: number, fromUnit: string, toUnit: string) => {
  const convertedAmount = convertUnit(amount, fromUnit, toUnit);
  return convertedAmount.toFixed(2);
};
</script>
