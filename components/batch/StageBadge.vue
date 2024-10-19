<template>
  <UBadge variant="soft" :color="getStatusColor">{{ stageName }}</UBadge>
</template>

<script setup lang="ts">
const props = defineProps({
  stage: {
    type: String,
    required: true,
  },
});
const stageName = computed(() => {
  switch (props.stage) {
    case "pending":
      return "Pending";
    case "firstFermentation":
      return "First Fermentation";
    case "secondFermentation":
      return "Second Fermentation";
    case "completed":
      return "Completed";
    case "discarded":
      return "Discarded";
    default:
      return "Unknown";
  }
});
const getStatusColor = computed(() => {
  switch (props.stage) {
    case "pending":
      return "yellow";
    case "firstFermentation":
      return "pink";
    case "secondFermentation":
      return "blue";
    case "completed":
      return "green";
    case "discarded":
      return "red";
    default:
      return "gray";
  }
});
</script>
