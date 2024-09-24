<template>
  <div
    class="min-h-screen bg-gradient-to-b from-gray-100 to-white dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-white transition-colors duration-300"
  >
    <!-- Hero Section -->
    <section class="container mx-auto px-4 py-20 text-center">
      <h1
        class="text-5xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400"
      >
        Elevate Your Kombucha Craft
      </h1>
      <p class="text-xl mb-8 max-w-2xl mx-auto">
        Unleash the full potential of your kombucha with our intelligent
        fermentation tracker.
      </p>
      <UButton
        size="lg"
        to="/recipes"
        variant="outline"
        label="Browse Recipes"
        class="mr-4"

      />
      <UButton
        to="/batches/create-batch"
        size="lg"
        color="primary"
        label="Start Brewing Smarter"
      />
    
    </section>

    <!-- Features Section -->
    <section class="container mx-auto px-4 py-20">
      <h2 class="text-3xl font-bold mb-12 text-center">Brew with Precision</h2>
      <div class="grid md:grid-cols-3 gap-8">
        <UCard
          v-for="feature in features"
          :key="feature.title"
          :ui="{
            base: 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700',
          }"
        >
          <template #header>
            <div class="p-4">
              <UIcon
                :name="feature.icon"
                class="h-12 w-12 mb-4 text-purple-600 dark:text-purple-400"
              />
              <h3 class="text-xl font-semibold mb-2">{{ feature.title }}</h3>
            </div>
          </template>
          <p>{{ feature.description }}</p>
        </UCard>
      </div>
    </section>

    <!-- Benefits Section -->
    <section
      class="container mx-auto px-4 py-20 bg-gray-50 dark:bg-gray-900 rounded-lg"
    >
      <h2 class="text-3xl font-bold mb-12 text-center">Why KombuchaTrack?</h2>
      <div class="grid md:grid-cols-2 gap-8">
        <div
          v-for="benefit in benefits"
          :key="benefit.title"
          class="flex items-start"
        >
          <UIcon
            :name="benefit.icon"
            class="h-8 w-8 mr-4 text-green-500 dark:text-green-400 flex-shrink-0"
          />
          <div>
            <h3 class="text-xl font-semibold mb-2">{{ benefit.title }}</h3>
            <p>{{ benefit.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonial Section -->
    <section class="container mx-auto px-4 py-20">
      <UCard
        :ui="{
          base: 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700',
        }"
      >
        <div class="flex flex-col md:flex-row items-center">
          <!-- <img
            src="/placeholder/150/150"
            alt="Sarah K."
            class="rounded-full w-24 h-24 mb-4 md:mb-0 md:mr-6"
          /> -->
          <div>
            <blockquote class="text-xl italic mb-4">
              "KombuchaTrack has transformed my brewing. The consistency and
              quality of my batches have never been better!"
            </blockquote>
            <p class="font-semibold text-purple-600 dark:text-purple-400">
              - Sarah K., Kombucha Artisan
            </p>
          </div>
        </div>
      </UCard>
    </section>

    <!-- Final CTA Section -->
    <section class="container mx-auto px-4 py-20 text-center">
      <h2 class="text-3xl font-bold mb-6">
        Ready to Brew Your Best Batch Yet?
      </h2>
      <p class="text-xl mb-8 max-w-2xl mx-auto">
        Join the community of passionate brewers who have elevated their
        kombucha game with KombuchaTrack.
      </p>
      <UButton size="lg" color="primary" label="Start Your Brewing Journey" />
    </section>

    <!-- Footer -->
    <footer
      class="container mx-auto px-4 py-8 text-center text-gray-600 dark:text-gray-400"
    >
      <p>
        &copy; {{ new Date().getFullYear() }} KombuchaTrack. All rights
        reserved.
      </p>
    </footer>
  </div>
</template>

<script setup lang="ts">
const features = [
  {
    title: "Real-time Monitoring",
    description:
      "Track pH levels, temperature, and fermentation progress with precision.",
    icon: "i-heroicons-chart-bar",
  },
  {
    title: "Comprehensive Batch History",
    description:
      "Access detailed records of all your kombucha batches for continuous improvement.",
    icon: "i-heroicons-clock",
  },
  {
    title: "Intelligent Alerts",
    description:
      "Receive timely notifications for optimal fermentation and flavoring stages.",
    icon: "i-heroicons-bell-alert",
  },
];

const benefits = [
  {
    title: "Unparalleled Consistency",
    description:
      "Achieve signature flavor profiles across all your batches with data-driven insights.",
    icon: "i-heroicons-trophy",
  },
  {
    title: "Efficiency Boost",
    description:
      "Streamline your brewing process and focus on creativity and experimentation.",
    icon: "i-heroicons-rocket-launch",
  },
  {
    title: "In-depth Analytics",
    description:
      "Leverage powerful data analysis to refine and perfect your brewing techniques.",
    icon: "i-heroicons-presentation-chart-line",
  },
  {
    title: "Seamless Scalability",
    description:
      "Effortlessly manage and track multiple batches as you expand your kombucha production.",
    icon: "i-heroicons-arrow-trending-up",
  },
];
</script>
