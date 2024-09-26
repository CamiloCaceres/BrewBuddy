<template>
  <UContainer class="container mx-auto max-w-4xl">
    <h1 class="text-3xl font-bold my-6">Batch Details: {{ batch.name }}</h1>
    <div v-if="batch" class="space-y-6">
      <UCard>
        <template #header>
          <div class="flex justify-between items-center">
            <h2 class="text-xl font-semibold">
              Current Stage: {{ getCurrentStageName() }}
            </h2>
            <UBadge :color="getStatusColor()">{{ batch.status }}</UBadge>
          </div>
        </template>
        <div class="space-y-4">
          <p>
            <strong>Current Day:</strong> {{ batch.currentFermentationDay }}
          </p>
          <UProgress
            :value="fermentationProgress"
            color="primary"
            class="mb-2"
          />
          <p>{{ fermentationProgressText }}</p>

          <div class="flex space-x-2">
            <AddEntry @submit="handleEntrySubmit" />
            <UButton
              v-for="action in getCurrentStageActions()"
              :key="action"
              @click="performAction(action)"
            >
              {{ getActionDisplayName(action) }}
            </UButton>
          </div>
        </div>
      </UCard>
      <UCard>
        <template #header>
          <h2 class="text-xl font-semibold">Recipe: {{ batch.recipeName }}</h2>
        </template>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p><strong>Tea Type:</strong> {{ batch.teaType }}</p>
            <p>
              <strong>Sugar:</strong> {{ batch.sugar.amount
              }}{{ batch.sugar.unit }} ({{ batch.sugar.type }})
            </p>
            <p>
              <strong>Water:</strong> {{ batch.water.amount
              }}{{ batch.water.unit }}
            </p>
            <p>
              <strong>Tea:</strong> {{ batch.tea.amount }}{{ batch.tea.unit }}
            </p>
            <p>
              <strong>Starter:</strong> {{ batch.starter.amount
              }}{{ batch.starter.unit }}
            </p>
            <p>
              <strong>Yield:</strong> {{ batch.yield.amount
              }}{{ batch.yield.unit }}
            </p>
          </div>
          <div>
            <h3 class="text-lg font-semibold mb-2">Ingredients:</h3>
            <ul>
              <li
                v-for="ingredient in batch.ingredients"
                :key="ingredient.name"
              >
                {{ ingredient.name }}: {{ ingredient.amount }}g
              </li>
            </ul>
          </div>
        </div>
      </UCard>

      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold">Batch Information</h3>
        </template>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p>
              <strong>Start Date:</strong> {{ formatDate(batch.startDate) }}
            </p>
            <p>
              <strong>First Fermentation Vessel:</strong> {{ batch.f1Vessel }}
            </p>
            <p>
              <strong>Second Fermentation Vessel:</strong> {{ batch.f2Vessel }}
            </p>
          </div>
          <div>
            <p>
              <strong>Tracking Temperature:</strong>
              {{ batch.trackTemperature ? "Yes" : "No" }}
            </p>
            <p>
              <strong>Tracking pH:</strong> {{ batch.trackpH ? "Yes" : "No" }}
            </p>
            <p>
              <strong>Expected F1 End Date:</strong>
              {{ batch.expected_f1_end_date }}
            </p>
            <p>
              <strong>Expected F2 End Date:</strong>
              {{ batch.expected_f2_end_date }}
            </p>
          </div>
        </div>
      </UCard>
    </div>
    <div v-else>
      <p>Loading batch details...</p>
    </div>
  </UContainer>

</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRoute, useRouter } from "nuxt/app";
import type { KombuchaEntry } from "@/types";

const route = useRoute();
const router = useRouter();

interface FlavorProfile {
  sweetness: number;
  acidity: number;
  bitterness: number;
  carbonation: number;
}

interface Ingredient {
  name: string;
  amount: number;
}

interface Batch {
  recipeId: number;
  recipeName: string;
  name: string;
  teaType: string;
  sugar: { amount: number; unit: string; type: string };
  ingredients: Ingredient[];
  instructions: {
    brewing: string;
    firstFermentation: string;
    secondFermentation: string;
  };
  fermentation: {
    firstFermentation: { minDays: number; maxDays: number };
    secondFermentation: { minDays: number; maxDays: number };
  };
  water: { amount: number; unit: string };
  tea: { amount: number; unit: string };
  starter: { amount: number; unit: string };
  yield: { amount: number; unit: string };
  startDate: Date;
  status: "pending" | "firstFermentation" | "secondFermentation" | "completed";
  currentFermentationDay: number;
  entries: KombuchaEntry[];
  f1Vessel: string;
  f2Vessel: string;
  trackTemperature: boolean;
  trackpH: boolean;
  expected_f1_end_date: string;
  expected_f2_end_date: string;
}

// Mock data (replace with actual data fetching logic)
const batch = ref<Batch>({
  recipeId: 1,
  recipeName: "Classic Kombucha",
  name: "Summer Batch #1",
  teaType: "Black Tea",
  sugar: { amount: 200, unit: "grams", type: "White Sugar" },
  ingredients: [
    { name: "Raspberry", amount: 200 },
    { name: "Mint", amount: 5 },
    { name: "Pineapple", amount: 100 },
  ],
  instructions: {
    brewing: "Brew tea and add sugar",
    firstFermentation:
      "Cool to room temperature, Add starter tea and SCOBY, Cover and ferment for 7-10 days",
    secondFermentation:
      "Bottle and add flavoring if desired, Second fermentation for 2-3 days",
  },
  fermentation: {
    firstFermentation: { minDays: 7, maxDays: 10 },
    secondFermentation: { minDays: 2, maxDays: 3 },
  },
  water: { amount: 2000, unit: "ml" },
  tea: { amount: 15, unit: "grams" },
  starter: { amount: 200, unit: "ml" },
  yield: { amount: 2, unit: "liters" },
  startDate: new Date("2023-09-24"),
  status: "pending",
  currentFermentationDay: 3,
  f1Vessel: "Large Glass Jar",
  f2Vessel: "Swing Top Bottles",
  trackTemperature: true,
  trackpH: false,
  expected_f1_end_date: "2023-10-01",
  expected_f2_end_date: "2023-10-04",
  entries: [],
});

const isOpen = ref(false);

const handleEntrySubmit = (formData: KombuchaEntry) => {
  console.log("New entry:", formData);
  batch.value.entries.push({
    ...formData,
    // Do I need this below?
    date: new Date(),
    dateString: new Date().toISOString().split("T")[0],
    fermentationStage: batch.value.status === "firstFermentation" ? "F1" : "F2",
    fermentationDay: batch.value.currentFermentationDay,
    pH: formData.pH,
    temperature: formData.temperature,
    notes: formData.notes,
    flavorProfile: {
      sweetness: 0,
      acidity: 0,
      bitterness: 0,
      carbonation: 0,
    },
  });
};

const fermentationProgress = computed(() => {
  const totalDays =
    batch.value.fermentation.firstFermentation.maxDays +
    batch.value.fermentation.secondFermentation.maxDays;
  return (batch.value.currentFermentationDay / totalDays) * 100;
});

const fermentationProgressText = computed(() => {
  if (batch.value.status === "firstFermentation") {
    return `Day ${batch.value.currentFermentationDay} of ${batch.value.fermentation.firstFermentation.maxDays} (First Fermentation)`;
  } else if (batch.value.status === "secondFermentation") {
    const secondFermentationDay =
      batch.value.currentFermentationDay -
      batch.value.fermentation.firstFermentation.maxDays;
    return `Day ${secondFermentationDay} of ${batch.value.fermentation.secondFermentation.maxDays} (Second Fermentation)`;
  } else {
    return "Fermentation Complete";
  }
});

const getCurrentStageName = () => {
  switch (batch.value.status) {
    case "pending":
      return "Batch Created";
    case "firstFermentation":
      return "First Fermentation (F1)";
    case "secondFermentation":
      return "Second Fermentation (F2)";
    case "completed":
      return "Completed";
    default:
      return "Unknown";
  }
};

const getStatusColor = () => {
  switch (batch.value.status) {
    case "pending":
      return "gray";
    case "firstFermentation":
    case "secondFermentation":
      return "blue";
    case "completed":
      return "green";
    default:
      return "gray";
  }
};
const getCurrentStageActions = () => {
  const actions = ["discardBatch"];

  if (batch.value.status !== "completed") {
    actions.unshift("moveToNextStage");
  }

  return actions;
};
const getActionDisplayName = (action: string) => {
  switch (action) {
    case "moveToNextStage":
      return batch.value.status === "pending"
        ? "Start First Fermentation"
        : "Move to Next Stage";
    case "discardBatch":
      return "Discard Batch";
    default:
      return action;
  }
};
const performAction = (action: string) => {
  console.log(`Performing action: ${action}`);

  switch (action) {
    case "moveToNextStage":
      moveToNextStage();
      break;

    case "discardBatch":
      discardBatch();
      break;
    default:
      console.log(`Action not implemented: ${action}`);
  }
};
const moveToNextStage = () => {
  switch (batch.value.status) {
    case "pending":
      batch.value.status = "firstFermentation";
      batch.value.currentFermentationDay = 1;
      break;
    case "firstFermentation":
      batch.value.status = "secondFermentation";
      batch.value.currentFermentationDay =
        batch.value.fermentation.firstFermentation.maxDays + 1;
      break;
    case "secondFermentation":
      batch.value.status = "completed";
      batch.value.currentFermentationDay =
        batch.value.fermentation.firstFermentation.maxDays +
        batch.value.fermentation.secondFermentation.maxDays;
      break;
    case "completed":
      console.log("Batch is already completed");
      break;
  }
};

const discardBatch = () => {
  batch.value.status = "pending";
  batch.value.currentFermentationDay = 0;
};

const formatDate = (date: Date): string => {
  return date.toLocaleDateString();
};

// Additional actions available at all stages
const commonActions = [
  "View Batch Timeline",
  "View/Edit Recipe Used",
  "Set Reminders",
  "Share Batch Progress",
];

const formState = reactive({
  temperature: 0,
  pH: 0,
  notes: "",
});
</script>
