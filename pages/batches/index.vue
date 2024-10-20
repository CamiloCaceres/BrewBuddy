<template>
  <div v-if="isPending">
    <UProgress indeterminate />
  </div>
  <div v-else-if="isError">
    <UAlert color="red" title="Error">
      {{ error }}
    </UAlert>
  </div>
  <div v-else>
    <h1 class="text-4xl font-bold my-6">Batches</h1>
    <div class="flex flex-wrap items-center gap-4 mb-8">
      <UInput
        v-model="searchQuery"
        icon="i-heroicons-magnifying-glass"
        placeholder="Search batches"
        class="flex-grow max-w-md"
      />
      <USelect
        v-model="selectedFilter"
        :options="filterOptions"
        placeholder="Filter batches"
        icon="i-heroicons-adjustments-horizontal-20-solid"
        class="w-48"
      />
      <UButton
        icon="i-heroicons-plus"
        to="/batches/create"
        class="sm:ml-auto"
      >
        Create Batch
      </UButton>
    </div>
      <h1 class="text-2xl font-bold py-4"> {{ filterOptions.find(option => option.value === selectedFilter)?.label }}</h1>
    <div v-auto-animate class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <BatchCard
        v-for="batch in filteredBatches"
        :key="batch.id"
        :batch="batch"
      />
    </div>
   
  </div>
</template>

<script setup lang="ts">
import { useQuery } from "@tanstack/vue-query";
import { computed } from "vue";
const { getAllBatches } = usePocketBase();


const searchQuery = ref('')

const selectedFilter = ref('all')

const filteredBatches = computed(() => {
  if (selectedFilter.value === 'all') return batches.value
  else if (selectedFilter.value === 'active') return batches.value?.filter(batch => batch.stage !== 'completed' && batch.stage !== 'discarded')
  return batches.value?.filter(batch => batch.stage === selectedFilter.value)

})

const filterOptions = [
  { label: 'All Batches', value: 'all' },
  { label: 'Active Batches', value: 'active' },
  { label: 'Fermentation 1', value: 'firstFermentation' },
  { label: 'Fermentation 2', value: 'secondFermentation' },
  { label: 'Discarded Batches', value: 'discarded' },
  { label: 'Completed Batches', value: 'completed' }
]

watch(selectedFilter, (newValue) => {
  console.log(`Filter changed to: ${newValue}`)
  // Implement your filtering logic here
})

const {
  isPending,
  isError,
  data: batches,
  error,
} = useQuery({
  queryKey: ["batches"],
  queryFn: () => getAllBatches(),
});

const activeBatches = computed(
  () =>
    batches.value?.filter(
      (batch) => batch.stage !== "completed" && batch.stage !== "discarded"
    ) || []
);
</script>
