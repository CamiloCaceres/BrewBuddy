<template>
  <div v-if="isLoading">
    <h1>Loading...</h1>
  </div>
  <div v-else-if="isError">
    <h1>Error: {{ error }}</h1>
  </div>
  <div v-else>
    <h1 class="text-3xl font-bold my-6">{{ batch.name }}</h1>
    <UCard>
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">
            Current Stage: {{ getCurrentStageName(batch.stage) }}
          </h2>
          <UBadge :color="getStatusColor(batch.stage)">{{
            batch.stage
          }}</UBadge>
        </div>
      </template>
      <div class="space-y-4">
        <p>
          <strong>Current Day:</strong>
          {{ currentFermentationDay ? currentFermentationDay : "0" }}
        </p>
        <UProgress :value="fermentationProgress" color="primary" />
        <p>{{ fermentationProgressText }}</p>

        <div class="flex space-x-2">
            <UButton v-if="batch.stage !== 'discarded'" icon="i-heroicons-trash" color="red" variant="outline" :loading="isDiscardingBatch" @click="discardBatch">Discard Batch</UButton>
          <UButton :loading="isUpdatingBatch" @click="moveToNextStage">{{ getNextStageName }}</UButton>
        </div>
      </div>
    </UCard>
    <!-- TODO: if stage is pending, add a calendar with the expected fermentation days,  -->
  </div>
</template>

<script setup>
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
const { slug } = useRoute().params;
const { getBatchBySlug, updateBatch } = usePocketBase();

const queryClient = useQueryClient()

const { isLoading, isError, data: batch, error } = useQuery({
  queryKey: ["batch", slug],
  queryFn: () => getBatchBySlug(slug),
});

const { mutate: updateBatchMutation } = useMutation({
  mutationFn: (newBatch) => updateBatch(batch.value.id, newBatch),
  onSuccess: (data) => {
    queryClient.setQueryData(["batch", slug], data)
    isUpdatingBatch.value = false;
    isDiscardingBatch.value = false;
  },
  onError: () => {
    isUpdatingBatch.value = false;
  },
})

//this function calculates the current fermentation day based on the start date and the current date
const currentFermentationDay = computed(() => {
  const startDate = new Date(batch.value.start_date);
  const currentDate = new Date();
  const timeDifference = currentDate.getTime() - startDate.getTime();
  const daysDifference = Math.floor(timeDifference / (1000 * 3600 * 24));
  return daysDifference;
});
// Computes the fermentation progress as a percentage based on the current fermentation day and total fermentation days.
const fermentationProgress = computed(() => {
  if (!batch.value?.startDate || !batch.value?.expand?.recipe) {
    return 0;
  }
  const totalDays =
    (batch.value.expand.recipe.F1Days || 0) +
    (batch.value.expand.recipe.F2Days || 0);
  return totalDays > 0 ? (currentFermentationDay.value / totalDays) * 100 : 0;
});

// Computes the fermentation progress text based on the current stage of fermentation.
const fermentationProgressText = computed(() => {
  if (!batch.value?.stage || !batch.value?.expand?.recipe) {
    return "Loading...";
  }
  if (batch.value.stage === "firstFermentation") {
    return `Day ${currentFermentationDay.value} of ${batch.value.expand.recipe.F1Days || 0} (First Fermentation)`;
  } else if (batch.value.stage === "secondFermentation") {
    const secondFermentationDay =
      currentFermentationDay.value -
      (batch.value.expand.recipe.F1Days || 0);
    return `Day ${secondFermentationDay} of ${batch.value.expand.recipe.F2Days || 0} (Second Fermentation)`;
  } else if(batch.value.stage === "pending") {
    return "Pending to start fermentation";
  } else {
    return "Fermentation Complete";
  }
});


const isUpdatingBatch = ref(false);
//TODO: when moving to next stage, calculate the previous stage days and save them in the batch record
const moveToNextStage = () => {
  isUpdatingBatch.value = true;
  switch (batch.value.stage) {
    case "pending":
    updateBatchMutation({ stage: "firstFermentation" });
      break;
    case "firstFermentation":
      updateBatchMutation({ stage: "secondFermentation" });
      break;
    case "secondFermentation":
      updateBatchMutation({ stage: "completed" });
      break;
  }
}

const isDiscardingBatch = ref(false);
const discardBatch = () => {
  isDiscardingBatch.value = true;
  updateBatchMutation({ stage: "discarded" });
}

</script>
