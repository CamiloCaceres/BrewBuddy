<template>
  <div class="container mx-auto p-6 max-w-2xl">
    <h1 class="text-3xl font-bold mb-6">Add New Recipe</h1>

    <form @submit.prevent="handleSubmit">
      <div class="space-y-4">
        <UFormGroup label="Recipe Name">
          <UInput v-model="recipe.name" placeholder="Enter recipe name" />
        </UFormGroup>

        <UFormGroup label="Description">
          <UTextarea
            v-model="recipe.description"
            placeholder="Enter recipe description"
          />
        </UFormGroup>

        <h2 class="text-xl font-bold mb-2">Ingredients</h2>

        <UFormGroup label="Sugar">
          <div class="flex space-x-2">
            <UInput
              v-model.number="recipe.sugar.amount"
              type="number"
              placeholder="Amount"
              class="w-24"
            />
            <USelectMenu
              v-model="recipe.sugar.unit"
              :options="units"
              placeholder="Unit"
            />
            <UInput
              v-model="recipe.sugarType"
              placeholder="Sugar type"
              class="flex-grow"
            />
          </div>
        </UFormGroup>

        <UFormGroup label="Water">
          <div class="flex space-x-2">
            <UInput
              v-model.number="recipe.water.amount"
              type="number"
              placeholder="Amount"
              class="w-24"
            />
            <USelectMenu
              v-model="recipe.water.unit"
              :options="units"
              placeholder="Unit"
            />
          </div>
        </UFormGroup>

        <UFormGroup label="Tea">
          <div class="flex space-x-2">
            <UInput
              v-model.number="recipe.tea.amount"
              type="number"
              placeholder="Amount"
              class="w-24"
            />
            <USelectMenu
              v-model="recipe.tea.unit"
              :options="units"
              placeholder="Unit"
            />
            <USelectMenu
              v-model="recipe.teaType"
              :options="teaTypes"
              placeholder="Select a tea type"
            />
          </div>
        </UFormGroup>

        <UFormGroup label="Starter">
          <div class="flex space-x-2">
            <UInput
              v-model.number="recipe.starter.amount"
              type="number"
              placeholder="Amount"
              class="w-24"
            />
            <USelectMenu
              v-model="recipe.starter.unit"
              :options="units"
              placeholder="Unit"
            />
          </div>
        </UFormGroup>

        <UFormGroup label="Fermentation 2 Ingredients">
          <div
            v-for="(ingredient, index) in recipe.F2ingredients"
            :key="index"
            class="flex space-x-2 mb-2"
          >
            <UInput
              v-model="ingredient.name"
              placeholder="Ingredient name"
              class="flex-grow"
            />
            <UInput
              v-model.number="ingredient.amount"
              type="number"
              placeholder="Amount"
              class="w-24"
            />
            <USelectMenu
              v-model="ingredient.unit"
              :options="units"
              placeholder="Unit"
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

        <h2 class="text-xl font-bold mb-2">Instructions</h2>
        <UButton
          block
          variant="outline"
          @click="addStandardInstructions"
          class="w-full mb-2"
        >
          Use Standard Instructions
        </UButton>

        <UFormGroup label="Brewing">
          <UTextarea
            v-model="recipe.instructions.brewing"
            placeholder="Enter brewing instructions"
          />
        </UFormGroup>

        <UFormGroup label="First Fermentation">
          <UTextarea
            v-model="recipe.instructions.firstFermentation"
            placeholder="Enter first fermentation instructions"
          />
        </UFormGroup>

        <UFormGroup label="Second Fermentation">
          <UTextarea
            v-model="recipe.instructions.secondFermentation"
            placeholder="Enter second fermentation instructions"
          />
        </UFormGroup>

        <h2 class="text-xl font-bold mb-2">Fermentation Details</h2>

        <UFormGroup label="First Fermentation (days)">
          <div class="flex space-x-2">
            <UInput
              v-model.number="recipe.F1Days"
              type="number"
              placeholder="F1 days"
            />
          </div>
        </UFormGroup>

        <UFormGroup label="Second Fermentation (days)">
          <div class="flex space-x-2">
            <UInput
              v-model.number="recipe.F2Days"
              type="number"
              placeholder="F2 days"
            />
          </div>
        </UFormGroup>

        <FlavorProfile
          :initial-flavor-profile="recipe.flavorProfile"
          @update:flavor-profile="updateFlavorProfile"
        />

        <UFormGroup label="Tags">
          <UInput
            v-model="tagsInput"
            placeholder="Enter tags (comma-separated)"
            @keydown.enter="addTag"
          />
          <div class="flex flex-wrap mt-2">
            <span
              v-for="(tag, index) in recipe.tags"
              :key="index"
              class="bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
            >
              {{ tag }}
              <button @click="removeTag(index)" class="ml-1 text-red-500">
                &times;
              </button>
            </span>
          </div>
        </UFormGroup>
        <UFormGroup>
          <div class="flex items-center">
            <UCheckbox v-model="recipe.isPublic" />
            <span class="ml-2">Make this recipe public</span>
          </div>
        </UFormGroup>

        <UButton type="submit" block>Add Recipe</UButton>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import type {
  KombuchaRecipe,
  Ingredient,
  BakersPercentageRecipe,
  Unit,
} from "@/types";
import { usePocketBase } from "@/composables/usePocketBase";

const { pb, currentUser } = usePocketBase();

const recipe: KombuchaRecipe = reactive({
  id: 1,
  name: "",
  description: "",
  teaType: "",
  sugar: { amount: 0, unit: "grams" },
  sugarType: "White Sugar",
  F2ingredients: [] as Ingredient[],
  instructions: {
    brewing: "",
    firstFermentation: "",
    secondFermentation: "",
  },
  F1Days: 7,
  F2Days: 14,
  water: { amount: 0, unit: "ml" },
  tea: { amount: 0, unit: "grams" },
  starter: { amount: 0, unit: "ml" },
  flavorProfile: {
    sweetness: 0,
    acidity: 0,
    bitterness: 0,
    carbonation: 0,
  },
  tags: [] as string[],
  createdAt: new Date(),
  updatedAt: new Date(),
  ratings: { averageRating: 0, numberOfRatings: 0 },
  author: "",
  isPublic: false,
});

const tagsInput = ref("");

const teaTypes = [
  "Black Tea",
  "Green Tea",
  "White Tea",
  "Oolong Tea",
  "Pu-erh Tea",
  "Blend",
];

const units = ["grams", "ml", "liters", "cups", "ounces"];

// Define the conversion factors
const conversionFactors: Record<Unit, number> = {
  ml: 1, // Assuming 1ml of water = 1g
  liters: 1000,
  cups: 236.588,
  ounces: 28.3495,
  grams: 1,
};

// Function to convert a value from one unit to grams
function convertToGrams(value: number, unit: Unit): number {
  const lowerCaseUnit = unit.toLowerCase() as Unit;
  if (!(lowerCaseUnit in conversionFactors)) {
    throw new Error(`Unsupported unit: ${unit}`);
  }
  return value * conversionFactors[lowerCaseUnit];
}

function convertToBakersPercentage(
  recipe: KombuchaRecipe
): BakersPercentageRecipe {
  // First, convert all ingredients to grams
  const waterInGrams = convertToGrams(recipe.water.amount, recipe.water.unit);
  const sugarInGrams = convertToGrams(recipe.sugar.amount, recipe.sugar.unit);
  const teaInGrams = convertToGrams(recipe.tea.amount, recipe.tea.unit);
  const starterInGrams = convertToGrams(
    recipe.starter.amount,
    recipe.starter.unit
  );

  // Calculate percentages based on water as 100%
  return {
    water: 100, // Water is always 100%
    sugar: (sugarInGrams / waterInGrams) * 100,
    tea: (teaInGrams / waterInGrams) * 100,
    starter: (starterInGrams / waterInGrams) * 100,
  };
}

const addStandardInstructions = () => {
  recipe.instructions.brewing = `1. Brew tea for 10-15 minutes. 
2. Add sugar and stir until dissolved. 
3. Allow to cool to room temperature.`;
  recipe.instructions.firstFermentation = `1. Add SCOBY and starter tea to the cooled sweet tea. 
2. Cover with a breathable cloth. 
3. Let ferment for 7-10 days at room temperature.`;
  recipe.instructions.secondFermentation = `1. Remove SCOBY and transfer kombucha to bottles. 
2. Add flavoring if desired. 
3. Seal bottles and let ferment for 1-3 days at room temperature.`;
};

const addIngredient = () => {
  recipe.F2ingredients.push({ name: "", amount: 0, unit: "grams" });
};

const removeIngredient = (index: number) => {
  recipe.F2ingredients.splice(index, 1);
};

const addTag = () => {
  const newTags = tagsInput.value
    .split(",")
    .map((tag) => tag.trim())
    .filter((tag) => tag !== "");
  recipe.tags.push(...newTags);
  tagsInput.value = "";
};

const removeTag = (index: number) => {
  recipe.tags.splice(index, 1);
};

const updateFlavorProfile = (newFlavorProfile: {
  sweetness: number;
  acidity: number;
  bitterness: number;
  carbonation: number;
}) => {
  recipe.flavorProfile = newFlavorProfile;
};

function prepareRecipeForSubmission(recipe: KombuchaRecipe) {
  const bakersPercentage = convertToBakersPercentage(recipe);

  return {
    name: recipe.name,
    description: recipe.description,
    author: currentUser.value?.id, // Assuming the user is logged in
    sugar: bakersPercentage.sugar,
    sugarType: recipe.sugarType,
    water: bakersPercentage.water,
    starter: bakersPercentage.starter,
    teaType: recipe.teaType,
    flavorProfile: JSON.stringify(recipe.flavorProfile),
    F1Days: recipe.F1Days,
    F2Days: recipe.F2Days,
    F2ingredients: JSON.stringify(recipe.F2ingredients),
    isPublic: recipe.isPublic,
  };
}

const handleSubmit = async () => {
  // Validate form
  if (
    !recipe.name ||
    !recipe.description ||
    recipe.F2ingredients.some((i) => !i.name || !i.amount || !i.unit) ||
    !recipe.instructions.brewing ||
    !recipe.instructions.firstFermentation ||
    !recipe.instructions.secondFermentation
  ) {
    alert("Please fill in all required fields");
    return;
  }

  // Update timestamps
  recipe.updatedAt = new Date();

  // Send data to backend
  try {
    const preparedRecipe = prepareRecipeForSubmission(recipe);

    //PocketBase
    const record = await pb.collection("recipes").create(preparedRecipe);

    console.log("Recipe created:", record);

    // Navigate to the new recipe view
    navigateTo(`/recipes/${record.id}`);
  } catch (error) {
    console.error("Error creating recipe:", error);
    alert("An error occurred while saving the recipe. Please try again.");
  }
};
</script>
