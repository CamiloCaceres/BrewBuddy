<!-- FermentationProgress.vue -->
<template>
    <div>
      <UProgress :value="progress" color="primary" />
      <p>{{ progressText }}</p>
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue';
  
  const props = defineProps({
    currentDay: {
      type: Number,
      required: true
    },
    totalDays: {
      type: Number,
      required: true
    },
    stage: {
      type: String,
      required: true
    },
    f1Days: {
      type: Number,
      required: true
    },
    f2Days: {
      type: Number,
      required: true
    }
  });
  
  const progress = computed(() => {
    return props.totalDays > 0 ? (props.currentDay / props.totalDays) * 100 : 0;
  });
  
  const progressText = computed(() => {
    if (props.stage === "firstFermentation") {
      return `Day ${props.currentDay} of ${props.f1Days} (First Fermentation)`;
    } else if (props.stage === "secondFermentation") {
      const secondFermentationDay = props.currentDay - props.f1Days;
      return `Day ${secondFermentationDay} of ${props.f2Days} (Second Fermentation)`;
    } else if (props.stage === "pending") {
      return "Pending to start fermentation";
    } else {
      return "Fermentation Complete";
    }
  });
  </script>