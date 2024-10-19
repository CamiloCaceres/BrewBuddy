<template>
  <div>
    <UProgress :value="progress" :color="progressColor" />
    <p class="mt-2 text-sm">{{ progressText }}</p>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  currentDay: {
    type: Number,
    required: true,
  },
  totalDays: {
    type: Number,
    required: true,
  },
  stage: {
    type: String,
    required: true,
  },
  f1Days: {
    type: Number,
    required: true,
  },
  f2Days: {
    type: Number,
    required: true,
  },
});

const progress = computed(() => {
  if (
    isNaN(props.currentDay) ||
    isNaN(props.totalDays) ||
    props.totalDays <= 0
  ) {
    return 0;
  }
  return Math.min((props.currentDay / props.totalDays) * 100, 100);
});

const progressColor = computed(() => {
  switch (props.stage) {
    case "firstFermentation":
      return "pink";
    case "secondFermentation":
      return "blue";
    case "completed":
      return "green";
    case "discarded":
      return "red";
    case "pending":
    default:
      return "yellow";
  }
});

const progressText = computed(() => {
  if (isNaN(props.currentDay)) {
    return "Invalid date";
  }

  switch (props.stage) {
    case "firstFermentation":
      return `Day ${props.currentDay} of ${props.f1Days} (First Fermentation)`;
    case "secondFermentation":
      const secondFermentationDay = Math.max(
        1,
        props.currentDay - props.f1Days
      );
      return `Day ${secondFermentationDay} of ${props.f2Days} (Second Fermentation)`;
    case "pending":
      return "Pending to start fermentation";
    case "completed":
      return "Fermentation Complete";
    case "discarded":
      return "Batch Discarded";
    default:
      return "Unknown stage";
  }
});
</script>
