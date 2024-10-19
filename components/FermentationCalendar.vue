<template>
  <div v-if="startDate" v-auto-animate class="mb-4 flex flex-col gap-2">
    <h2 class="font-semibold mb-2 text-lg">Fermentation Timeline</h2>
    <div class="flex gap-2 mb-2">
      <div class="flex items-center gap-2">
        <span class="w-8 h-8 bg-pink-500 rounded-full"></span>
        <span class="font-semibold">F1</span>
        <span v-if="f1Days">({{ f1Days }} days)</span>
      </div>
      <div class="flex items-center gap-2">
        <span class="w-8 h-8 bg-blue-500 rounded-full"></span>
        <span class="font-semibold">F2</span>
        <span v-if="f2Days">({{ f2Days }} days)</span>
      </div>
    </div>
    <VCalendar v-if="startDate" :attributes="attributes" />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps({
  startDate: {
    type: String,
    required: true,
  },
  expectedF1End: {
    type: String,
    required: true,
  },
  expectedF2End: {
    type: String,
    required: true,
  },
  f1Days: {
    type: Number,
    default: null,
  },
  f2Days: {
    type: Number,
    default: null,
  },
});

const attributes = computed(() => {
  return [
    {
      highlight: "pink",
      dates: {
        start: new Date(props.startDate),
        end: new Date(props.expectedF1End),
      },
    },
    {
      highlight: "blue",
      dates: {
        start: new Date(props.expectedF1End),
        end: new Date(props.expectedF2End),
      },
    },
  ];
});
</script>
