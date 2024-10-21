<template>
  <UCard class="relative">
    <template #header>
      <div class="flex justify-between items-center">
        <h2 class="text-lg sm:text-xl font-semibold ">
          {{ recipe.name }}
        </h2>
       
        <UBadge
          :color="getTeaTypeColor(recipe.teaType)"
          class="whitespace-nowrap flex-shrink-0"
          >{{ recipe.teaType }}</UBadge
        >
    </div>
    </template>
    <div
      class="flex flex-col justify-between items-start text-sm space-y-2"
    >
      <p class="text-sm text-gray-800 dark:text-gray-200 break-all text-wrap ">
        {{ recipe.description }}
      </p>
      <p>Fermentation time: {{ recipe.F1Days + recipe.F2Days }} days</p>
      <p class="text-gray-500 text-xs sm:text-sm">
        By {{ recipe.expand?.author.name }} | Updated:
        {{ formatDate(recipe.updated) }}
      </p>
    </div>
    <template #footer>
      <div class="flex justify-end">
        <UButton
          variant="outline"
        :to="`/recipes/${recipe.id}`"
        class="ml-auto translate-y-4 md:translate-y-0"
        >View Recipe</UButton
      >
      </div>
    </template>
  </UCard>
</template>

<script setup lang="ts">
import { type BadgeColor } from "@/node_modules/@nuxt/ui/dist/runtime/types/badge";
import { type TeaType, type Recipe } from "@/types/recipe";

const props = defineProps<{
  recipe: Recipe;
}>();

const getTeaTypeColor = (teaType: TeaType): BadgeColor => {
  const colors: Record<TeaType, BadgeColor> = {
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
