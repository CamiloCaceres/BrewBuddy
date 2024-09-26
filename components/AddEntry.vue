<template>
    <UButton @click="openModal">Add Entry</UButton>
    <UModal v-model="isOpen" >
      <UCard>
        <template #header>
          <div class="flex justify-between items-center">
            <h3 class="text-xl font-semibold">Add Kombucha Entry</h3>
            <UButton
              variant="ghost"
              square
              @click="isOpen = false"
              icon="i-heroicons-x-mark"
            />
          </div>
        </template>
        <div class="mb-6">
          <h2 class="font-medium mb-2">Step {{ currentStep }} of {{ totalSteps }} </h2>
          <UProgress :value="currentStep" :max="totalSteps" color="primary" />
        </div>
        <UForm :state="formState" @submit="onSubmit" class="space-y-6">
          <!-- Step 1: Basic Information -->
          <div v-if="currentStep === 1">
            <h4 class="text-lg font-medium mb-4">Basic Information</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <UFormGroup label="Date" name="date">
                <UInput type="date" v-model="formState.dateString" />
              </UFormGroup>
              <UFormGroup label="Fermentation Stage" name="fermentationStage">
                <URadio
                  v-model="formState.fermentationStage"
                  :options="[
                    { label: 'First Fermentation', value: 'F1' },
                    { label: 'Second Fermentation', value: 'F2' },
                  ]"
                />
              </UFormGroup>
              <UFormGroup label="Fermentation Day" name="fermentationDay">
                <UInput type="number" v-model="formState.fermentationDay" />
              </UFormGroup>
            </div>
          </div>
  
          <!-- Step 2: Measurements -->
          <div v-if="currentStep === 2">
            <h4 class="text-lg font-medium mb-4">Measurements</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <UFormGroup label="Temperature" name="temperature">
                <div class="flex space-x-2">
                  <UInput type="number" v-model="formState.temperature.value" class="flex-grow" />
                  <USelect
                    v-model="formState.temperature.unit"
                    :options="[
                      { label: '°C', value: 'celsius' },
                      { label: '°F', value: 'fahrenheit' },
                    ]"
                    class="w-20"
                  />
                </div>
              </UFormGroup>
              <UFormGroup label="pH" name="pH">
                <UInput type="number" v-model="formState.pH" step="0.1" />
              </UFormGroup>
              <UFormGroup label="Pellicle Thickness" name="pellicle.thickness">
                <div class="flex space-x-2">
                  <UInput type="number" v-model="formState.pellicle.thickness" class="flex-grow" />
                  <USelect
                    v-model="formState.pellicle.unit"
                    :options="[
                      { label: 'mm', value: 'mm' },
                      { label: 'cm', value: 'cm' },
                      { label: 'in', value: 'inches' },
                    ]"
                    class="w-20"
                  />
                </div>
              </UFormGroup>
            </div>
          </div>
  
          <!-- Step 3: Appearance and Sensory Evaluation -->
          <div v-if="currentStep === 3">
            <h4 class="text-lg font-medium mb-4">Appearance and Sensory Evaluation</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <UFormGroup label="Color" name="appearance.color">
                <UInput type="text" v-model="formState.appearance.color" />
              </UFormGroup>
              <UFormGroup label="Clarity" name="appearance.clarity">
                <USelect
                  v-model="formState.appearance.clarity"
                  :options="[
                    { label: 'Clear', value: 'clear' },
                    { label: 'Slightly Cloudy', value: 'slightly cloudy' },
                    { label: 'Cloudy', value: 'cloudy' },
                    { label: 'Very Cloudy', value: 'very cloudy' },
                  ]"
                />
              </UFormGroup>
            </div>
            <UFormGroup label="Smell" name="smell">
              <UInput type="text" v-model="formState.smell" />
            </UFormGroup>
            <UFormGroup label="Flavor Profile" name="flavorProfile">
              <FlavorProfile
                :initial-flavor-profile="formState.flavorProfile"
                @update:flavor-profile="updateFlavorProfile"
              />
            </UFormGroup>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <UFormGroup label="Taste Rating" name="tasteRating">
                <UInput
                  type="number"
                  v-model="formState.tasteRating"
                  min="1"
                  max="5"
                  step="0.5"
                />
              </UFormGroup>
              <UFormGroup label="Overall Quality" name="overallQuality">
                <UInput
                  type="number"
                  v-model="formState.overallQuality"
                  min="1"
                  max="5"
                  step="0.5"
                />
              </UFormGroup>
            </div>
          </div>
  
          <!-- Step 4: Adjustments, Notes, and Images -->
          <div v-if="currentStep === 4">
            <h4 class="text-lg font-medium mb-4">Adjustments, Notes, and Images</h4>
            <UFormGroup label="Adjustments" name="adjustments">
              <UButton @click="addAdjustment" class="mb-2">Add Adjustment</UButton>
              <div
                v-for="(adjustment, index) in formState.adjustments"
                :key="index"
                class="flex space-x-2 mb-2"
              >
                <USelect
                  v-model="adjustment.type"
                  :options="[
                    { label: 'Temperature', value: 'temperature' },
                    { label: 'Ingredients', value: 'ingredients' },
                    { label: 'Fermentation Time', value: 'fermentation time' },
                    { label: 'Other', value: 'other' },
                  ]"
                  class="w-1/3"
                />
                <UInput
                  type="text"
                  v-model="adjustment.description"
                  placeholder="Description"
                  class="flex-grow"
                />
                <UButton @click="removeAdjustment(index)" icon="i-heroicons-trash" variant="ghost" />
              </div>
            </UFormGroup>
            <UFormGroup label="Notes" name="notes">
              <UTextarea v-model="formState.notes" />
            </UFormGroup>
            <UFormGroup label="Images" name="images">
              <UInput type="file" multiple @change="handleImageUpload" />
            </UFormGroup>
          </div>
  
          <!-- Navigation Buttons -->
          <div class="flex justify-between">
            <UButton
              v-if="currentStep > 1"
              @click="previousStep"
              variant="outline"
            >
              Previous
            </UButton>
            <div class="flex-grow"></div>
            <UButton
              v-if="currentStep < totalSteps"
              @click="nextStep"
              variant="outline"
            >
              Next
            </UButton>
            <UButton
              v-if="currentStep === totalSteps"
              type="submit"
              color="primary"
            >
              Submit
            </UButton>
          </div>
        </UForm>
      </UCard>
    </UModal>
  </template>
  
  <script setup lang="ts">
  import { reactive, ref, computed } from "vue";
  import type { KombuchaEntry } from "@/types";
  
  const emit = defineEmits<{
    (e: "submit", formData: KombuchaEntry): void;
  }>();
  
 
  const formState: KombuchaEntry = reactive({
    dateString: computed({
      get: () => formState.date.toISOString().split("T")[0],
      set: (val: string) => (formState.date = new Date(val)),
    }),
    date: new Date(),
    fermentationStage: "F1" as "F1" | "F2",
    fermentationDay: 1,
    temperature: {
      value: 0,
      unit: "celsius" as "celsius" | "fahrenheit",
    },
    pH: 0,
    notes: "",
    flavorProfile: {
      sweetness: 0,
      acidity: 0,
      bitterness: 0,
      carbonation: 0,
    },
    appearance: {
      color: "",
      clarity: "clear" as "clear" | "slightly cloudy" | "cloudy" | "very cloudy",
    },
    pellicle: {
      thickness: 0,
      unit: "mm" as "mm" | "cm" | "inches",
      appearance: "",
    },
    smell: "",
    tasteRating: 0,
    overallQuality: 0,
    adjustments: [] as {
      type: "temperature" | "ingredients" | "fermentation time" | "other";
      description: string;
    }[],
    images: [] as string[],
  });
  
  const isOpen = ref(false);
  const currentStep = ref(1);
  const totalSteps = 4;
  
  const progress = computed(() => (currentStep.value / totalSteps) * 100);
  
  const openModal = () => {
    isOpen.value = true;
    currentStep.value = 1;
  };
  
  const nextStep = () => {
    if (currentStep.value < totalSteps) {
      currentStep.value++;
    }
  };
  
  const previousStep = () => {
    if (currentStep.value > 1) {
      currentStep.value--;
    }
  };
  
  const updateFlavorProfile = (
    newFlavorProfile: KombuchaEntry["flavorProfile"]
  ) => {
    formState.flavorProfile = newFlavorProfile;
  };
  
  const addAdjustment = () => {
    formState.adjustments.push({ type: "temperature", description: "" });
  };
  
  const removeAdjustment = (index: number) => {
    formState.adjustments.splice(index, 1);
  };
  
  const handleImageUpload = (event: Event) => {
    const target = event.target as HTMLInputElement;
    if (target.files) {
      const files = Array.from(target.files);
      formState.images = files.map((file) => URL.createObjectURL(file));
    }
  };
  
  const onSubmit = () => {
    const entryData: KombuchaEntry = {
      ...formState,
      date: formState.date, // Use the Date object, not the string
    };
    emit("submit", entryData);
    isOpen.value = false;
  };
  </script>