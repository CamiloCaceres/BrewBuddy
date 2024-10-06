<template>
    <UCard class="my-4 sm:my-8">
      <template #header>
        <div
        class="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0"
        >
        <h1 class="text-xl sm:text-2xl font-bold">Recipes</h1>
        <UButton
        to="/recipes/create-recipe"
        color="primary"
        icon="i-heroicons-plus"
        class="hidden sm:inline-flex"
        >
        Create Recipe
      </UButton>
    </div>
  </template>
  <div v-if="query?.isPending" class="space-y-4 sm:space-y-6">
    <USkeleton v-for="i in 3" :key="i" class="h-32 w-full" />
  </div>
      <div v-else-if="query?.isError" class="text-red-500">Error: {{ query.error }}</div>

      <div v-else-if="query?.data" class="space-y-4 sm:space-y-6 relative">
        <UCard v-for="recipe in query.data" :key="recipe.id" class="p-4">
          <div
            class="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0"
          >
            <div class="w-full sm:w-3/4">
              <h2 class="text-lg sm:text-xl font-semibold">
                {{ recipe.name }}
              </h2>
              <p class="text-sm text-gray-600 dark:text-gray-400 mt-1 truncate">
                {{ recipe.description }}
              </p>
            </div>
            <UBadge
              :color="getTeaTypeColor(recipe.teaType)"
              class="absolute top-2 md:top-4 right-2 md:right-4"
              >{{ recipe.teaType }}</UBadge
            >
          </div>
          <div
            class="mt-4 flex flex-col justify-between items-start text-sm space-y-2 sm:space-y-0"
          >
            <p>Fermentation time: {{ recipe.F1Days + recipe.F2Days }} days</p>
            <p class="text-gray-500 text-xs sm:text-sm">
              By {{ recipe.expand?.author.name }} | Updated:
              {{ formatDate(recipe.updated) }}
            </p>
            <UButton
              variant="outline"
              :to="`/recipes/${recipe.id}`"
              class="ml-auto translate-y-4 md:translate-y-0"
              >View Recipe</UButton
            >
          </div>
        </UCard>
      </div>

  
    </UCard>

    <!-- FAB for mobile -->
    <UButton
      :ui="{ rounded: 'rounded-full' }"
      size="xl"
      to="/recipes/create-recipe"
      color="primary"
      icon="i-heroicons-plus"
      class="fixed right-4 bottom-4 shadow-lg sm:hidden"
      aria-label="Create Recipe"
    />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { usePocketBase } from "@/composables/usePocketBase";
import { useQuery } from "@tanstack/vue-query";

const { getAllRecipes } = usePocketBase();

const query = ref();


//this page throws an error when the query is not inside onMounted. [id].vue works fine without it. Currently investigating.
onMounted(() => {
  query.value = useQuery({
    queryKey: ["recipes"],
    queryFn: () => getAllRecipes(),
  });
});

const getTeaTypeColor = (teaType: string) => {
  const colors: any = {
    Green: "green",
    Black: "gray",
    Oolong: "orange",
    White: "yellow",
    Herbal: "pink",
  };
  return colors[teaType] || "blue";
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};
</script>
