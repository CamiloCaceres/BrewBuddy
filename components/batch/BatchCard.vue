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
      <div class="flex justify-between items-center">
        <BatchFermentationProgress 
          :currentDay="currentFermentationDay"
          :totalDays="totalFermentationDays"
          :stage="batch.stage"
          :f1Days="batch.expand?.recipe?.F1Days"
          :f2Days="batch.expand?.recipe?.F2Days"
        />
  
      </div>


      <div class="grid grid-cols-2 gap-4">
        <div>
          <h4 class="text-sm font-semibold mb-2">Batch Information</h4>
       
        </div>
        <div>
          <h4 class="text-sm font-semibold mb-2">Journal</h4>
        </div>
      </div>
    </div>
  </UCard>
</template>

<script setup>
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
  const timeDifference = currentDate.getTime() - startDate.getTime();
  const daysDifference = Math.floor(timeDifference / (1000 * 3600 * 24));
  return daysDifference;
});
// Computes the fermentation progress as a percentage based on the current fermentation day and total fermentation days.
const totalFermentationDays = computed(() => {
  return (props.batch.expand?.recipe?.F1Days ) + (props.batch.expand?.recipe?.F2Days);
});

</script>
