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
    <h1 class="text-2xl font-bold py-4">Batches</h1>
    <div class="space-y-4">
      <BatchCard  v-for="batch in batches" :key="batch.id" :batch="batch" />
    </div>
    <UButton to="/batches/create">Create Batch</UButton>
    <UButton to="/batches/view-batch">View Batch</UButton>
  </div>
</template>

<script setup lang="ts">
import { useQuery } from "@tanstack/vue-query";
const { getAllBatches } = usePocketBase();

const {
  isPending,
  isError,
  data: batches,
  error,
} = useQuery({
  queryKey: ["batches"],
  queryFn: () => getAllBatches(),
});
</script>
