<template>
  <div class="container mx-auto p-6 max-w-2xl">
    <h1 class="text-3xl font-bold mb-6">Add New Recipe</h1>

    <form @submit.prevent="handleSubmit">
      <div class="space-y-4">
        <UFormGroup label="Recipe Name">
          <UInput v-model="name" placeholder="Enter recipe name" />
        </UFormGroup>
        <div class="mb-4">
          <UFormGroup label="Measurement Unit">
            <USelectMenu
              v-model="measurementUnit"
              :options="measurementUnits"
              placeholder="Select a measurement unit"
            />
          </UFormGroup>
        </div>
        <h2 class="text-xl font-bold mb-2">Fermentation 1 Details</h2>

        <UFormGroup type="number" :label="`Water amount (${measurementUnit})`">
          <UInput
            v-model="water_amount"
            type="number"
            :placeholder="`Amount (${measurementUnit})`"
          />
        </UFormGroup>

        <div class="flex gap-4">
          <UFormGroup class="flex-1" label="Tea Type">
            <USelectMenu
              v-model="teaType"
              :options="teaTypes"
              placeholder="Select a tea type"
            />
          </UFormGroup>
          <UFormGroup type="number" :label="`Tea amount (${measurementUnit})`">
            <UInput
              v-model="tea_amount"
              type="number"
              :placeholder="`Amount (${measurementUnit})`"
            />
          </UFormGroup>
        </div>

        <UFormGroup type="number" :label="`Sugar amount (${measurementUnit})`">
          <UInput
            v-model="sugar_amount"
            type="number"
            :placeholder="`Amount (${measurementUnit})`"
          />
        </UFormGroup>

        <UFormGroup :label="`Starter (${measurementUnit})`">
          <UInput v-model="starter_amount" placeholder="Enter starter amount" />
        </UFormGroup>

        <UFormGroup label="Expected Fermentation 1 Time (days)">
          <UInput
            v-model="fermentation1Days"
            placeholder="Enter number of days"
            type="number"
          />
        </UFormGroup>

        <h2 class="text-xl font-bold mb-2">Fermentation 2 Details</h2>
        <UFormGroup label="Fermentation 2 duration (days)">
          <UInput
            v-model="fermentation2Days"
            placeholder="Enter number of days"
            type="number"
          />
        </UFormGroup>

        <UFormGroup :label="`Ingredients in ${measurementUnit}`">
          <div
            v-for="(ingredient, index) in ingredients"
            :key="index"
            class="flex space-x-2 mb-2"
          >
            <UInput
              v-model="ingredient.name"
              placeholder="Ingredient name"
              class="flex-grow"
            />
            <UInput
              v-model="ingredient.amount"
              type="number"
              placeholder="Amount"
              class="w-24"
            />
            <UButton
              color="red"
              variant="soft"
              icon="i-heroicons-x-mark-20-solid"
              @click="removeIngredient(index)"
            />
          </div>
          <UButton
            block
            variant="outline"
            @click="addIngredient"
            class="w-full mt-2"
          >
            Add Ingredient
          </UButton>
        </UFormGroup>

        <UFormGroup label="Notes">
          <UTextarea
            v-model="notes  "
            placeholder="Enter recipe notes "
          />
        </UFormGroup>

        <UButton type="submit" block>Add Recipe</UButton>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";

interface Ingredient {
  name: string;
  amount: number | undefined;
}

const name = ref("");
const teaType = ref("");
const sugar_amount = ref(0);
const water_amount = ref(0);
const tea_amount = ref(0);
const starter_amount = ref(0);
const ingredients = ref<Ingredient[]>([{ name: "", amount: undefined }]);
const notes  = ref("");

const fermentation1Days = ref(0);
const fermentation2Days = ref(0);

const expectedF1EndDate = computed(() => {
  if (fermentation1Days.value > 0) {
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + fermentation1Days.value);
    const day = String(endDate.getDate()).padStart(2, "0");
    const month = String(endDate.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const year = endDate.getFullYear();
    return `${day}-${month}-${year}`; // Format as DD-MM-YYYY
  }
  return "";
});

const addIngredient = () => {
  ingredients.value.push({ name: "", amount: undefined });
};

const removeIngredient = (index: number) => {
  ingredients.value.splice(index, 1);
};

const teaTypes = [
  "Black Tea",
  "Green Tea",
  "White Tea",
  "Oolong Tea",
  "Pu-erh Tea",
  "Blend",
];

const measurementUnit = ref("grams");
const measurementUnits = ["cups", "liters", "grams", "ounces"];

// Conversion factors
const conversionFactors: Record<string, Record<string, number>> = {
  cups: { liters: 0.236588, grams: 236.588, ounces: 8 },
  liters: { cups: 4.22675, grams: 1000, ounces: 33.814 },
  grams: { cups: 0.00422675, liters: 0.001, ounces: 0.03527396 },
  ounces: { cups: 0.125, liters: 0.0295735, grams: 28.3495 },
};

function convertUnit(value: number, fromUnit: string, toUnit: string): number {
  if (fromUnit === toUnit) return value;
  if (conversionFactors[fromUnit] && conversionFactors[fromUnit][toUnit]) {
    return value * conversionFactors[fromUnit][toUnit];
  }
  throw new Error(`Invalid unit conversion from ${fromUnit} to ${toUnit}`);
}

// Watch for changes in the measurementUnit value
watch(measurementUnit, (newUnit, oldUnit) => {
  // Convert sugar amount
  sugar_amount.value = convertUnit(sugar_amount.value, oldUnit, newUnit);

  // Convert ingredient amounts
  ingredients.value.forEach((ingredient) => {
    if (ingredient.amount !== undefined) {
      ingredient.amount = convertUnit(ingredient.amount, oldUnit, newUnit);
    }
  });
});
const handleSubmit = () => {
  // Validate form
  if (
    !name.value ||
    ingredients.value.some((i) => !i.name || !i.amount) ||
    !notes  .value
  ) {
    alert("Please fill in all fields");
    return;
  }

  // Here you would typically send this data to your backend
  const newRecipe = {
    name: name.value,
    teaType: teaType.value,
    sugar_amount: sugar_amount.value,
    ingredients: ingredients.value,
    notes : notes  .value,
    measurementUnit: measurementUnit.value,
    fermentation1Days: fermentation1Days.value,
    expectedF1EndDate: expectedF1EndDate.value,
    fermentation2Days: fermentation2Days.value,
    water_amount: water_amount.value,
    tea_amount: tea_amount.value,
    starter_amount: starter_amount.value,

  };
  console.log("New recipe:", newRecipe);
  // Reset form or navigate to the new recipe view
};
</script>
