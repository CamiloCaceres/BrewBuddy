<template>
  <UContainer class="py-8 max-w-4xl">
    <div v-if="isPending">
      <UProgress indeterminate />
    </div>
    <div v-else-if="isError">
      <div>
        <p>Error: {{ error }}</p>
      </div>
    </div>
    <UCard v-else>
      <template #header>
        <div class="flex justify-between items-center">
          <div>
            <div>
              <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100">
                {{ data?.name }}
              </h1>
              <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {{ data?.teaType }}
              </p>
            </div>
          </div>

          <div>
            <UButton :to="`/batches/create/${data?.id}`"
              >Create Batch from this recipe</UButton
            >
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
      <div v-if="data?.F2ingredients">
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
            {{ data?.F1Days }} days
          </p>
          <p class="text-sm text-gray-600 dark:text-gray-300 p-1">
            <span class="font-semibold text-md">F2:</span>
            {{ data?.F2Days }} days
          </p>
        </div>
        <div>
          <h3 class="text-lg font-semibold mb-2 dark:text-gray-200">
            Description
          </h3>
          <p class="text-sm text-gray-600 dark:text-gray-300 p-1">
            {{ data?.description }}
          </p>
        </div>
        <div>
          <h3 class="text-lg font-semibold mt-4 mb-2 dark:text-gray-200">
            Flavor Profile:
          </h3>
          <div v-if="data?.flavorProfile" class="flex flex-row gap-4">
            <UMeter
              :value="data?.flavorProfile.sweetness"
              :max="10"
              label="Sweetness"
            />
            <UMeter
              :value="data?.flavorProfile.acidity"
              :max="10"
              label="Acidity"
            />
            <UMeter
              :value="data?.flavorProfile.bitterness"
              :max="10"
              label="Bitterness"
            />
            <UMeter
              :value="data?.flavorProfile.carbonation"
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
            <strong>Author:</strong> {{ data?.expand?.author.name }}
          </p>
          <p class="text-sm text-gray-600 dark:text-gray-300 p-1">
            <strong>Public:</strong> {{ data?.isPublic ? "Yes" : "No" }}
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
import { useQuery } from "@tanstack/vue-query";

const { getRecipeById } = usePocketBase();

const route = useRoute();
const recipeId = route.params.id as string;

const { isPending, isError, data, error } = useQuery({
  queryKey: ["recipe"],
  queryFn: () => getRecipeById(recipeId),
});

const desiredYield = ref(1000); // Default yield of 1000g
const selectedUnit = ref("g");
const unitOptions = ["g", "liters", "oz", "lb"];

const columns = [
  { key: "label", label: "Ingredient" },
  { key: "amount", label: "Amount" },
  { key: "percentage", label: "Percentage" },
];

const conversionFactors = {
  g: 1,
  liters: 1000, // 1 liter of water weighs 1000g
  oz: 28.3495,
  lb: 453.592,
};

const convertUnit = (value: number, fromUnit: string, toUnit: string) => {
  const gramsValue =
    value * conversionFactors[fromUnit as keyof typeof conversionFactors];
  return (
    gramsValue / conversionFactors[toUnit as keyof typeof conversionFactors]
  );
};

const ingredientWithAmount = computed(() => {
  return {
    sugar: {
      amount: data.value?.sugar,
      unit: "grams",
    },
    water: {
      amount: data.value?.water,
      unit: "ml",
    },
    starter: {
      amount: data.value?.starter,
      unit: "grams",
    },
    tea: {
      amount: data.value?.tea,
      unit: "grams",
    },
  };
});

const recipeDetails = computed(() => {
  if (!data.value?.sugar || !data.value?.water || !data.value?.starter)
    return [];

  const waterAmount = desiredYield.value;
  const sugarAmount =
    (ingredientWithAmount.value?.sugar.amount / 100) * waterAmount;
  const starterAmount =
    (ingredientWithAmount.value?.starter.amount / 100) * waterAmount;
  const teaAmount =
    (ingredientWithAmount.value?.tea.amount / 100) * waterAmount;

  return [
    {
      label: "Water",
      amount: formatAmount(waterAmount, "g", selectedUnit.value),
      percentage: "100%",
    },
    {
      label: "Sugar",
      amount: `${formatAmount(sugarAmount, "g", selectedUnit.value)} (${
        data.value?.sugarType
      })`,
      percentage: `${ingredientWithAmount.value?.sugar.amount.toFixed(2)}%`,
    },
    {
      label: "Starter",
      amount: formatAmount(starterAmount, "g", selectedUnit.value),
      percentage: `${ingredientWithAmount.value?.starter.amount.toFixed(2)}%`,
    },
    {
      label: `${data.value?.teaType}`,
      amount: formatAmount(teaAmount, "g", selectedUnit.value),
      percentage: `${ingredientWithAmount.value?.tea.amount.toFixed(2)}%`,
    },
  ];
});

const f2Columns = [
  { key: "name", label: "Ingredient" },
  { key: "amount", label: "Amount" },
  { key: "unit", label: "Unit" },
];

const f2Ingredients = computed(() => {
  if (!data.value?.F2ingredients) return [];

  return data.value?.F2ingredients.map((ingredient: Ingredient) => ({
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
