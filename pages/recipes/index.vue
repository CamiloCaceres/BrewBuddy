<template>
  <div v-if="query?.isPending" class="space-y-4 sm:space-y-6">
    <USkeleton v-for="i in 3" :key="i" class="h-32 w-full" />
  </div>
  <div v-else-if="query?.isError" class="text-red-500">
    Error: {{ query.error }}
  </div>

  <div v-else-if="query?.data">
    <h1 class="text-4xl font-bold my-6">Recipes</h1>
    <div class="flex flex-wrap items-center gap-4 mb-8">
      <UInput
        v-model="searchQuery"
        icon="i-heroicons-magnifying-glass"
        placeholder="Search recipes"
        class="flex-grow max-w-md"
      />
      <USelect
        v-model="selectedFilter"
        :options="filterOptions"
        placeholder="Filter recipes"
        icon="i-heroicons-adjustments-horizontal-20-solid"
        class="w-48"
      />
      <UButton
        icon="i-heroicons-plus"
        to="/recipes/create-recipe"
        class="sm:ml-auto"
      >
        Create Recipe
      </UButton>
    </div>
    <h1 class="text-2xl font-bold py-4">
      {{
        filterOptions.find((option) => option.value === selectedFilter)?.label
      }}
    </h1>

    <div class="grid grid-cols-1 sm:grid-cols-2  gap-4 ">
      <RecipeCard
        v-for="recipe in filteredRecipes"
        :key="recipe.id"
        :recipe="recipe"
      />
    </div>
  </div>

</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from "vue";
import { usePocketBase } from "@/composables/usePocketBase";
import { useQuery } from "@tanstack/vue-query";

const { getAllRecipes } = usePocketBase();

const query = ref();

onMounted(() => {
  query.value = useQuery({
    queryKey: ["recipes"],
    queryFn: () => getAllRecipes(),
  });
});

const searchQuery = ref("");

const selectedFilter = ref("all");

const filteredRecipes = computed(() => {
  if (!query.value?.data) return [];
  let recipes = query.value.data;
  if (selectedFilter.value !== "all") {
    recipes = recipes.filter((recipe: any) => recipe.teaType === selectedFilter.value);
  }
  if (searchQuery.value) {
    const search = searchQuery.value.toLowerCase();
    recipes = recipes.filter((recipe: any) =>
      recipe.name.toLowerCase().includes(search) ||
      recipe.description.toLowerCase().includes(search)
    );
  }
  return recipes;
});

const filterOptions = [
  { label: "All Recipes", value: "all" },
  { label: "Black Tea", value: "Black" },
  { label: "Green Tea", value: "Green" },
  { label: "Oolong Tea", value: "Oolong" },
  { label: "White Tea", value: "White" },
  { label: "Herbal Tea", value: "Herbal" },
];

watch(selectedFilter, (newValue) => {
  console.log(`Filter changed to: ${newValue}`);
});
</script>