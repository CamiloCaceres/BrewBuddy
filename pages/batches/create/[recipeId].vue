<template>
  <UContainer class="p-4 max-w-3xl">
    <h1 class="text-3xl font-bold mb-6">
      Create New Batch from {{ recipe ? recipe.name : "Recipe" }}
    </h1>

    <UForm
      v-auto-animate
      :state="formState"
      @submit="createBatch"
      class="space-y-6"
    >
      <UFormGroup label="Batch Name" name="name" required>
        <UInput
          v-model="formState.name"
          placeholder="Enter a name for this batch"
        />
      </UFormGroup>
      <div class="flex justify-between items-center">
        <h1>Recipe used: {{ recipe ? recipe.name : "" }}</h1>
        <UButton
          :loading="!recipe"
          target="_blank"
          :to="`/recipes/${$route.params.recipeId}`"
          >View Recipe</UButton
        >
      </div>



      <div class="flex gap-4 items-end md:items-center">
        <UFormGroup label="Measurement System">
          <USelectMenu v-model="selectedUnit" :options="unitOptions" />
        </UFormGroup>

        <UFormGroup :label="`Batch Size (${selectedUnit})`" name="batchSize">
          <UInput type="number" v-model="formState.batchSize" />
        </UFormGroup>
      </div>

      <div class="flex gap-4">
        <UFormGroup label="Track Vessel" name="isTrackVessel">
          <UToggle v-model="formState.isTrackVessel" />
        </UFormGroup>
        <UFormGroup label="Track PH" name="isTrackPH">
          <UToggle v-model="formState.isTrackPH" />
        </UFormGroup>
        <UFormGroup label="Track Temperature" name="isTrackTemperature">
          <UToggle v-model="formState.isTrackTemperature" />
        </UFormGroup>
      </div>
      <div class="flex gap-4 w-full" v-if="formState.isTrackVessel">
        <UFormGroup
          label="First Fermentation Vessel"
          name="f1Vessel"
        >
          <UInput
            v-model="formState.f1Vessel"
            placeholder="Enter the vessel used for first fermentation"
          />
        </UFormGroup>

        <UFormGroup
          label="Second Fermentation Vessel"
          name="f2Vessel"
        >
          <UInput
            v-model="formState.f2Vessel"
            placeholder="Enter the vessel used for second fermentation"
          />
        </UFormGroup>
      </div>
      <UFormGroup
        v-if="formState.isTrackPH"
        :label="`Initial PH (${formState.initialPH})`"
        name="initialPH"
      >
        <URange v-model="formState.initialPH" :min="0" :max="14" :step="1" />
      </UFormGroup>

      <UFormGroup
        v-if="formState.isTrackTemperature"
        label="Initial Temperature"
        name="initialTemperature"
      >
        <UInput
          v-model="formState.initialTemperature"
          placeholder="Enter the initial temperature of the batch"
        />
      </UFormGroup>

      <UFormGroup label="Additional Notes" name="notes">
        <UTextarea
          resize
          autoresize
          :rows="2"
          v-model="formState.notes"
          placeholder="Enter any additional notes for this batch"
        />
      </UFormGroup>

      <div v-if="formState.startDate" v-auto-animate class="mb-4 flex flex-col gap-2">
        <h2 class="text-xl font-semibold mb-2">Fermentation Timeline</h2>
        <div  class="flex gap-2 mb-2">
          <div class="flex items-center gap-2">
            <span class="w-8 h-8 bg-green-500 rounded-full"></span>
            <span class="font-semibold">F1</span
            ><span>({{ recipe?.F1Days }} days)</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="w-8 h-8 bg-blue-500 rounded-full"></span>
            <span class="font-semibold">F2</span
            ><span>({{ recipe?.F2Days }} days)</span>
          </div>
        </div>
        <VCalendar v-if="formState.startDate" :attributes="attributes" />
      </div>

      <UButton block icon="i-heroicons-plus" :loading="isSubmitting" type="submit">Create Batch</UButton>
    </UForm>
  </UContainer>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from "vue";
import { useRouter } from "nuxt/app";


const { currentUser, postBatch } = usePocketBase();


const router = useRouter();
const route = useRoute();
const isSubmitting = ref(false);

const { getRecipeById, pb } = usePocketBase();

const recipeId = ref(route.params.recipeId);
// Assuming you're passing the recipe as a prop or getting it from a store
const recipe = ref();

onMounted(async () => {
  recipe.value = await getRecipeById(recipeId.value as string);
  console.log(recipe.value);
});

const selectedUnit = ref("grams");
const unitOptions = ["grams", "cups"];

const formState = reactive({
  startDate: "",
  name: recipe.value?.name + " Batch",
  batchSize: recipe.value?.yield.amount,
  batchType: "batch" as "continuous" | "batch",
  measurementSystem: unitOptions[0],
  isTrackVessel: false,
  f1Vessel: "",
  f2Vessel: "",
  isTrackPH: false,
  isTrackTemperature: false,
  notes: "",
  initialPH: 0,
  initialTemperature: 0,
});

const expected_f1_end_date = computed(() => {
  if (!formState.startDate || !recipe.value) return null;
  const startDate = new Date(formState.startDate);
  return new Date(
    startDate.getTime() + recipe.value.F1Days * 24 * 60 * 60 * 1000
  );
});

const expected_f2_end_date = computed(() => {
  if (!formState.startDate || !recipe.value) return null;
  const startDate = new Date(formState.startDate);
  const totalDays = recipe.value.F1Days + recipe.value.F2Days;
  return new Date(startDate.getTime() + totalDays * 24 * 60 * 60 * 1000);
});

const attributes = computed(() => {
  if (
    !formState.startDate ||
    !expected_f1_end_date.value ||
    !expected_f2_end_date.value
  )
    return [];

  return [
    {
      highlight: "green",
      dates: {
        start: new Date(formState.startDate),
        end: expected_f1_end_date.value,
      },
    },
    {
      highlight: "blue",
      dates: {
        start: expected_f1_end_date.value,
        end: expected_f2_end_date.value,
      },
    },
  ];
});

const batchForUpload = computed(() => {
  return {
    recipe: recipe.value.id,
    user: currentUser.value?.id,
    isTrackVessel: formState.isTrackVessel,
    isTrackTemperature: formState.isTrackTemperature,
    isTrackPH: formState.isTrackPH,
    f1Vessel: formState.f1Vessel,
    f2Vessel: formState.f2Vessel,
    initialPH: formState.initialPH,
    initialTemperature: formState.initialTemperature,
    batchType: formState.batchType,
    stage: "pending",
    name: formState.name,
  };
});
// need to validate all data, and check if user is logged in
//update api rules to only allow a user to create a batch to their own batches
const createBatch = async () => {
  isSubmitting.value = true;
  const batch = await postBatch(batchForUpload.value);
  const updatedBatch = await pb.collection('batches').update(batch.id, {
    slug: slugify(batch.name, batch.id),
  });
  isSubmitting.value = false;
  router.push(`/batches/${updatedBatch.slug}`);
};
</script>
