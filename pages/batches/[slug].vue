<template>
  <div v-if="isPending">
    <h1>Loading...</h1>
  </div>
  <div v-else-if="isError">
    <h1>Error: {{ error }}</h1>
  </div>
  <div v-else>
    <h1 class="text-3xl font-bold my-6">{{ batch.name }}</h1>
    <UCard class="mb-6">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">
            Current Stage: {{ getCurrentStageName(batch.stage) }}
          </h2>
          <BatchSettings />
        </div>
      </template>
      <div class="space-y-4">
        <p>
          Current Day:
          {{ currentFermentationDay ? currentFermentationDay : "0" }}
        </p>
        <FermentationProgress
          :currentDay="currentFermentationDay"
          :totalDays="totalFermentationDays"
          :stage="batch.stage"
          :f1Days="batch.expand?.recipe?.F1Days"
          :f2Days="batch.expand?.recipe?.F2Days"
        />

        <div class="flex space-x-2">
          <UButton
            v-if="batch.stage !== 'discarded' && batch.stage !== 'completed'"
            icon="i-heroicons-trash"
            color="red"
            variant="outline"
            :loading="isDiscardingBatch"
            @click="discardBatch"
            >Discard Batch</UButton
          >
          <UButton
            v-if="batch.stage !== 'completed' && batch.stage !== 'discarded'"
            :loading="isUpdatingBatch"
            @click="moveToNextStage"
            >{{ getNextStageName(batch.stage) }}</UButton
          >
        </div>
      </div>
    </UCard>
    <!-- TODO: if stage is pending, add a calendar with the expected fermentation days,  -->

    <UCard>
      <template #header>
        <h3 class="text-xl font-semibold">Batch Information</h3>
      </template>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p class="capitalize font-semibold">
            Brew Method:
            <span class="font-normal">{{ batch.brew_method }}</span>
          </p>
          <div v-if="batch.is_tracking_vessel">
            <p class="font-semibold">
              First Fermentation Vessel:
              <span class="font-normal">{{ batch.f1_vessel }}</span>
            </p>
            <p class="font-semibold">
              Second Fermentation Vessel:
              <span class="font-normal">{{ batch.f2_vessel }}</span>
            </p>
          </div>
          <div v-if="batch.is_tracking_temperature">
            <p class="font-semibold">
              Initial Temperature:
              <span class="font-normal">{{ batch.initial_temperature }}</span>
            </p>
          </div>
          <div v-if="batch.is_tracking_ph">
            <p class="font-semibold">
              Initial pH:
              <span class="font-normal">{{ batch.initial_ph }}</span>
            </p>
          </div>
        </div>

        <div>
          <p class="font-semibold">
            Tracking Vessel:
            <span class="font-normal">{{
              batch.is_tracking_vessel ? "Yes" : "No"
            }}</span>
          </p>
          <p class="font-semibold">
            Tracking Temperature:
            <span class="font-normal">{{
              batch.is_tracking_temperature ? "Yes" : "No"
            }}</span>
          </p>
          <p class="font-semibold">
            Tracking pH:
            <span class="font-normal">{{
              batch.is_tracking_PH ? "Yes" : "No"
            }}</span>
          </p>
        </div>

        <FermentationCalendar
          :startDate="batch.start_date"
          :expectedF1End="batch.expected_f1_end"
          :expectedF2End="batch.expected_f2_end"
          :f1Days="batch.expand?.recipe?.F1Days"
          :f2Days="batch.expand?.recipe?.F2Days"
        />
      </div>
    </UCard>
  </div>
</template>

<script setup>
import { useQuery, useMutation, useQueryClient } from "@tanstack/vue-query";
import FermentationProgress from "~/components/batch/FermentationProgress.vue";
const { slug } = useRoute().params;
const { getBatchBySlug, updateBatch } = usePocketBase();

const queryClient = useQueryClient();

const {
  isPending,
  isError,
  data: batch,
  error,
} = useQuery({
  queryKey: ["batch", slug],
  queryFn: () => getBatchBySlug(slug),
});

const { mutate: updateBatchMutation } = useMutation({
  mutationFn: (newBatch) => updateBatch(batch.value.id, newBatch),
  onSuccess: (data) => {
    queryClient.setQueryData(["batch", slug], data);
    isUpdatingBatch.value = false;
    isDiscardingBatch.value = false;
  },
  onError: () => {
    isUpdatingBatch.value = false;
  },
});

//this function calculates the current fermentation day based on the start date and the current date
const currentFermentationDay = computed(() => {
  const startDate = new Date(batch.value.start_date);
  const currentDate = new Date();
  const timeDifference = currentDate.getTime() - startDate.getTime();
  const daysDifference = Math.floor(timeDifference / (1000 * 3600 * 24));
  return daysDifference;
});
// Computes the fermentation progress as a percentage based on the current fermentation day and total fermentation days.
const totalFermentationDays = computed(() => {
  return (batch.value.expand?.recipe?.F1Days || 0) + (batch.value.expand?.recipe?.F2Days || 0);
});

const isUpdatingBatch = ref(false);
//TODO: when moving to next stage, calculate the previous stage days and save them in the batch record
const moveToNextStage = () => {
  isUpdatingBatch.value = true;
  switch (batch.value.stage) {
    case "pending":
      // sets the start date and calculates the expected end date for f1 and f2
      updateBatchMutation({
        stage: "firstFermentation",
        start_date: new Date().toISOString(),
        expected_f1_end: calculateExpectedEndDate(
          new Date(),
          batch.value.expand.recipe.F1Days || 7
        ).toISOString(),
        expected_f2_end: calculateExpectedEndDate(
          new Date(),
          batch.value.expand.recipe.F2Days || 3
        ).toISOString(),
      });
      break;

    case "firstFermentation":
      // sets the f1 end date
      updateBatchMutation({
        stage: "secondFermentation",
        f1_end_date: new Date().toISOString(),
      });
      break;
    case "secondFermentation":
      // sets the f2 end date
      updateBatchMutation({
        stage: "completed",
        end_date: new Date().toISOString(),
      });
      break;
  }
};

const isDiscardingBatch = ref(false);
const discardBatch = () => {
  isDiscardingBatch.value = true;
  updateBatchMutation({
    stage: "discarded",
    is_discarded: true,
    end_date: new Date().toISOString(),
  });
};
</script>
