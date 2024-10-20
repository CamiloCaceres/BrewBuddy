<template>
  <UCard>
    <template #header>
      <div class="flex justify-between items-center">
        <h3 class="text-lg font-semibold">{{ batch.name }}</h3>
        <StageBadge :stage="batch.stage" />
      </div>
      <p class="text-sm text-gray-500">{{ batch.type }}</p>
    </template>

    <div class="space-y-4">
      <BatchFermentationProgress
        :currentDay="currentFermentationDay"
        :totalDays="totalFermentationDays"
        :stage="batch.stage"
        :f1Days="batch.expand?.recipe?.F1Days"
        :f2Days="batch.expand?.recipe?.F2Days"
      />
    </div>
    <template #footer>
      <div class="flex justify-end">
        <UButton variant="outline" :to="`/batches/${batch.slug}`">
          <template #trailing>
            <UIcon
              name="i-heroicons-arrow-right-20-solid"
              class="w-5 h-5"
            /> </template
          >View Batch</UButton
        >
      </div>
    </template>
  </UCard>
</template>

<script setup lang="ts">
import StageBadge from "@/components/batch/StageBadge.vue";
const props = defineProps({
  batch: {
    type: Object,
    required: true,
  },
});

//this function calculates the current fermentation day based on the start date and the current date
const currentFermentationDay = computed(() => {
  const startDate = new Date(props.batch.start_date);
  const currentDate = new Date();
  if (isNaN(startDate.getTime())) {
    return 0; // Return 0 if the start date is invalid
  }
  const timeDifference = currentDate.getTime() - startDate.getTime();
  return Math.max(0, Math.floor(timeDifference / (1000 * 3600 * 24)));
});
// Computes the fermentation progress as a percentage based on the current fermentation day and total fermentation days.
const totalFermentationDays = computed(() => {
  const f1Days = props.batch.expand?.recipe?.F1Days || 0;
  const f2Days = props.batch.expand?.recipe?.F2Days || 0;
  return Math.max(1, f1Days + f2Days); // Ensure it's at least 1 to avoid division by zero
});
</script>
