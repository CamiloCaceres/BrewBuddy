<template>
    <div>
      <h2 class="text-xl font-bold mb-2">Flavor Profile</h2>
      <UFormGroup :ui="{ label: { base: 'text-gray-600 dark:text-gray-300 text-xs' } }"  :label="`Sweetness (${flavorProfile.sweetness}/10)`">
        <URange v-model="flavorProfile.sweetness" :min="0" :max="10" @update:model-value="updateFlavorProfile('sweetness', $event)" />
      </UFormGroup>
      <UFormGroup :ui="{ label: { base: 'text-gray-600 dark:text-gray-300 text-xs' } }"  :label="`Acidity (${flavorProfile.acidity}/10)`">
        <URange v-model="flavorProfile.acidity" :min="0" :max="10" @update:model-value="updateFlavorProfile('acidity', $event)" />
      </UFormGroup>
      <UFormGroup :ui="{ label: { base: 'text-gray-600 dark:text-gray-300 text-xs' } }"  :label="`Bitterness (${flavorProfile.bitterness}/10)`">
        <URange v-model="flavorProfile.bitterness" :min="0" :max="10" @update:model-value="updateFlavorProfile('bitterness', $event)" />
      </UFormGroup>
      <UFormGroup :ui="{ label: { base: 'text-gray-600 dark:text-gray-300 text-xs' } }"  :label="`Carbonation (${flavorProfile.carbonation}/10)`">
        <URange v-model="flavorProfile.carbonation" :min="0" :max="10" @update:model-value="updateFlavorProfile('carbonation', $event)" />
      </UFormGroup>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, watch } from "vue";
  
  const props = defineProps({
    initialFlavorProfile: {
      type: Object,
      required: true,
    },
  });
  
  const emit = defineEmits(['update:flavorProfile']);
  
  const flavorProfile = ref({
    sweetness: props.initialFlavorProfile.sweetness,
    acidity: props.initialFlavorProfile.acidity,
    bitterness: props.initialFlavorProfile.bitterness,
    carbonation: props.initialFlavorProfile.carbonation,
  });
  
  const updateFlavorProfile = (key: keyof typeof flavorProfile.value, value: number) => {
    flavorProfile.value[key] = value;
    emit('update:flavorProfile', { ...flavorProfile.value });
  };
  
  watch(() => props.initialFlavorProfile, (newValue) => {
    flavorProfile.value = {
      sweetness: newValue.sweetness,
      acidity: newValue.acidity,
      bitterness: newValue.bitterness,
      carbonation: newValue.carbonation
    };
  }, { deep: true });
  </script>