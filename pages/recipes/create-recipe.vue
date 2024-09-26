<template>
  <div class="container mx-auto p-6 max-w-2xl">
    <h1 class="text-3xl font-bold mb-6">Add New Recipe</h1>

    <form @submit.prevent="handleSubmit">
      <div class="space-y-4">
        <UFormGroup label="Recipe Name">
          <UInput v-model="recipe.name" placeholder="Enter recipe name" />
        </UFormGroup>

        <UFormGroup label="Description">
          <UTextarea v-model="recipe.description" placeholder="Enter recipe description" />
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
              v-model="recipe.sugar.type"
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

        <UFormGroup label="Other Ingredients">
          <div
            v-for="(ingredient, index) in recipe.ingredients"
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
              v-model.number="recipe.fermentation.firstFermentation.minDays"
              type="number"
              placeholder="Min days"
            />
            <UInput
              v-model.number="recipe.fermentation.firstFermentation.maxDays"
              type="number"
              placeholder="Max days"
            />
          </div>
        </UFormGroup>

        <UFormGroup label="Second Fermentation (days)">
          <div class="flex space-x-2">
            <UInput
              v-model.number="recipe.fermentation.secondFermentation.minDays"
              type="number"
              placeholder="Min days"
            />
            <UInput
              v-model.number="recipe.fermentation.secondFermentation.maxDays"
              type="number"
              placeholder="Max days"
            />
          </div>
        </UFormGroup>

        <FlavorProfile
      :initial-flavor-profile="recipe.flavorProfile"
      @update:flavor-profile="updateFlavorProfile"
    />

        <UFormGroup label="Difficulty">
          <USelectMenu
            v-model="recipe.difficulty"
            :options="difficultyLevels"
            placeholder="Select difficulty level"
          />
        </UFormGroup>

        <UFormGroup label="Yield">
          <div class="flex space-x-2">
            <UInput
              v-model.number="recipe.yield.amount"
              type="number"
              placeholder="Amount"
              class="w-24"
            />
            <USelectMenu
              v-model="recipe.yield.unit"
              :options="units"
              placeholder="Unit"
            />
          </div>
        </UFormGroup>

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
              <button @click="removeTag(index)" class="ml-1 text-red-500">&times;</button>
            </span>
          </div>
        </UFormGroup>

        <UFormGroup label="Author">
          <UInput v-model="recipe.author" placeholder="Enter author name" />
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

interface Ingredient {
  name: string;
  amount: number | undefined;
  unit: string;
}


const recipe = reactive({
  id: 1,
  name: "",
  description: "",
  teaType: "",
  sugar: { amount: 0, unit: "grams", type: "White Sugar" },
  ingredients: [] as Ingredient[],
  instructions: {
    brewing: "",
    firstFermentation: "",
    secondFermentation: "",
  },
  fermentation: {
    firstFermentation: { minDays: 0, maxDays: 0 },
    secondFermentation: { minDays: 0, maxDays: 0 },
  },
  water: { amount: 0, unit: "ml" },
  tea: { amount: 0, unit: "grams" },
  starter: { amount: 0, unit: "ml" },
  flavorProfile: {
    sweetness: 0,
    acidity: 0,
    bitterness: 0,
    carbonation: 0,
  },
  difficulty: "",
  yield: { amount: 0, unit: "liters" },
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

const units = ["grams", "ml", "liters", "cups", "ounces", "pieces", "leaves"];

const difficultyLevels = ["Beginner", "Intermediate", "Advanced"];

const addIngredient = () => {
  recipe.ingredients.push({ name: "", amount: 0, unit: "" });
};

const removeIngredient = (index: number) => {
  recipe.ingredients.splice(index, 1);
};

const addTag = () => {
  const newTags = tagsInput.value.split(',').map(tag => tag.trim()).filter(tag => tag !== "");
  recipe.tags.push(...newTags);
  tagsInput.value = "";
};

const removeTag = (index: number) => {
  recipe.tags.splice(index, 1);
};

const updateFlavorProfile = (newFlavorProfile: { sweetness: number; acidity: number; bitterness: number; carbonation: number }) => {
  recipe.flavorProfile = newFlavorProfile;
};

const handleSubmit = () => {
  // Validate form
  if (
    !recipe.name ||
    !recipe.description ||
    recipe.ingredients.some((i) => !i.name || !i.amount || !i.unit) ||
    !recipe.instructions.brewing ||
    !recipe.instructions.firstFermentation ||
    !recipe.instructions.secondFermentation
  ) {
    alert("Please fill in all required fields");
    return;
  }

  // Update timestamps
  recipe.updatedAt = new Date();

  // Send this data to backend
  console.log("New recipe:", recipe);
  // Reset form or navigate to the new recipe view
};
</script>