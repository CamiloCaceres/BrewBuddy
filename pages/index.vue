<template>
    <div class="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <!-- Navigation -->
  
  
      <!-- Hero Section -->
      <section class="container mx-auto px-4 py-20 text-center">
        <h1 class="text-5xl font-extrabold mb-6">Master Your Kombucha Fermentation</h1>
        <p class="text-xl mb-8 max-w-2xl mx-auto">
          Track, analyze, and perfect your kombucha batches with our advanced fermentation tracker.
        </p>
        <UButton size="lg" color="white" label="Start Tracking Free" class="mr-4" />
        <UButton to="/batches/new_batch" label="Add Batch" />
      </section>
  
      <!-- Features Section -->
      <section class="container mx-auto px-4 py-20">
        <h2 class="text-3xl font-bold mb-12 text-center">Key Features</h2>
        <UCard :ui="{ base: 'bg-gray-800 border-gray-700' }" class="grid md:grid-cols-3 gap-8">
          <template v-for="feature in features" :key="feature.title">
            <div>
              <h3 class="text-xl font-semibold mb-2">{{ feature.title }}</h3>
              <p>{{ feature.description }}</p>
            </div>
          </template>
        </UCard>
      </section>
  
      <!-- Benefits Section -->
      <section class="container mx-auto px-4 py-20">
        <h2 class="text-3xl font-bold mb-12 text-center">Why Choose KombuchaTrack?</h2>
        <div class="grid md:grid-cols-2 gap-8">
          <div v-for="benefit in benefits" :key="benefit.title" class="flex items-start">
            <UIcon name="i-heroicons-check-circle" class="h-6 w-6 mr-4 text-green-400 flex-shrink-0" />
            <div>
              <h3 class="text-xl font-semibold mb-2">{{ benefit.title }}</h3>
              <p>{{ benefit.description }}</p>
            </div>
          </div>
        </div>
      </section>
  
      <!-- Testimonial Section -->
      <section class="container mx-auto px-4 py-20">
        <UCard :ui="{ base: 'bg-gray-800 border-gray-700' }">
          <blockquote class="text-xl italic mb-4">
            "KombuchaTrack has revolutionized my brewing process. I've never had such consistent results!"
          </blockquote>
          <p class="font-semibold">- Sarah K., Kombucha Enthusiast</p>
        </UCard>
      </section>
  
      <!-- Final CTA Section -->
      <section class="container mx-auto px-4 py-20 text-center">
        <h2 class="text-3xl font-bold mb-6">Ready to Perfect Your Brew?</h2>
        <p class="text-xl mb-8 max-w-2xl mx-auto">
          Join thousands of kombucha brewers who have elevated their craft with KombuchaTrack.
        </p>
        <UButton size="lg" color="white" label="Get Started Now" />
      </section>
  
      <!-- Footer -->
      <footer class="container mx-auto px-4 py-8 text-center text-gray-400">
        <p>&copy; 2023 KombuchaTrack. All rights reserved.</p>
      </footer>
    </div>
  </template>
  
  <script setup>
  const features = [
    { title: 'Real-time Monitoring', description: 'Track pH levels, temperature, and fermentation progress in real-time.' },
    { title: 'Batch History', description: 'Keep a detailed history of all your kombucha batches for easy reference.' },
    { title: 'Smart Alerts', description: 'Receive notifications when your batch reaches optimal fermentation levels.' }
  ]

  const benefits = [
    { title: 'Consistent Quality', description: 'Achieve consistent flavor profiles across all your batches.' },
    { title: 'Time-Saving', description: 'Automate tracking and spend less time on manual monitoring.' },
    { title: 'Data-Driven Insights', description: 'Gain valuable insights to improve your brewing process.' },
    { title: 'Scalability', description: 'Easily manage multiple batches as you scale your production.' }
  ]
  </script>