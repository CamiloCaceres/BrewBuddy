<template>
  <UButton
    icon="i-heroicons-cog-6-tooth"
    color="gray"
    variant="ghost"
    @click="isOpen = true"
  />
  <UModal v-model="isOpen" :fullscreen="$device.isMobile">
    <UCard
      :ui="{
        base: 'h-full flex flex-col',
        body: {
          base: 'flex-grow overflow-auto',
        },
      }"
    >
      <template #header>
        <div class="flex justify-between items-center">
          <h1 class="text-xl font-bold">Batch Settings</h1>
          <UButton
            icon="i-heroicons-x-mark"
            color="gray"
            variant="ghost"
            @click="isOpen = false"
          />
        </div>
      </template>

      <div class="h-full">
        <h1>Batch Settings</h1>
        <UFormGroup label="Tracking Vessel">
            <UToggle v-model="isTrackingVessel" />
        </UFormGroup>
        <UFormGroup label="Tracking PH">
            <UToggle v-model="isTrackingPH" />
        </UFormGroup>
        <UFormGroup label="Tracking Temperature">
            <UToggle v-model="isTrackingTemperature" />
        </UFormGroup>

        <UFormGroup label="Change expected F1 end date">
            <UInput v-model="expectedF1EndDate" type="date" />
        </UFormGroup>
        <UFormGroup label="Change expected F2 end date">
            <UInput v-model="expectedF2EndDate" type="date" />
        </UFormGroup>
      </div>

      <template #footer>
        <div class="flex justify-end">
          <UButton
            color="green"
            icon="i-heroicons-check"
            @click="isOpen = false"
            >Save</UButton
          >
        </div>
      </template>
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
const isOpen = ref(false);
const isTrackingVessel = ref(false);
const isTrackingPH = ref(false);
const isTrackingTemperature = ref(false);
const expectedF1EndDate = ref();
const expectedF2EndDate = ref();    
</script>
