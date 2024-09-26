<template>
  <header class="px-4 py-4 bg-white dark:bg-gray-900 shadow-md transition-colors duration-300">
    <nav class="container mx-auto flex justify-between items-center">
      <NuxtLink to="/" class="text-2xl font-bold text-purple-600 dark:text-purple-400 transition-colors duration-300 flex items-center">
<!--         <img src="/api/placeholder/32/32" alt="KombuchaTrack Logo" class="h-8 w-8 mr-2" />
 -->        KombuchaTrack
      </NuxtLink>

      <!-- Desktop Menu -->
      <div class="hidden md:flex gap-4 items-center">
        <UButton
          v-for="link in links"
          :key="link.path"
          variant="ghost"
          :to="link.path"
          class="text-base font-medium hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-300"
        >
          <UIcon :name="link.icon" class="mr-2" />
          {{ link.name }}
        </UButton>
        <DarkModeButton />
        <UButton
          v-if="!isLoggedIn"
          to="/login"
          color="primary"
          class="ml-4"
        >
          Sign In
        </UButton>
        <UDropdown v-else>
          <UButton color="gray" class="ml-4">
           <!--  <UAvatar
              src="/api/placeholder/32/32"
              alt="User avatar"
              class="mr-2"
            /> -->
            My Account
          </UButton>
          <template #items>
            <UButton to="/profile">Profile</UButton>
            <UButton to="/settings">Settings</UButton>
            <UButton @click="logout">Logout</UButton>
          </template>
        </UDropdown>
      </div>

      <!-- Mobile Menu Button -->
      <UButton
        @click="isMenuOpen = !isMenuOpen"
        variant="ghost"
        class="md:hidden"
        aria-label="Toggle menu"
        :icon="isMenuOpen ? 'i-heroicons-x-mark' : 'i-heroicons-bars-3'"
      />

      <!-- Mobile Menu -->
      <div
        v-if="isMenuOpen"
        class="absolute top-16 left-0 right-0 bg-white dark:bg-gray-800 shadow-md md:hidden z-50 transition-all duration-300 ease-in-out motion-reduce:transition-none motion-reduce:hover:transform-none"
      >
        <div class="flex flex-col p-4 gap-4">
          <UButton
            v-for="link in links"
            :key="link.path"
            variant="ghost"
            :to="link.path"
            class="text-base font-medium justify-start"
            @click="isMenuOpen = false"
          >
            <UIcon :name="link.icon" class="mr-2" />
            {{ link.name }}
          </UButton>
          <div class="py-2">
            <DarkModeButton />
          </div>
          <UButton
            v-if="!isLoggedIn"
            to="/login"
            color="primary"
            class="mt-4"
            @click="isMenuOpen = false"
          >
            Sign In
          </UButton>
          <template v-else>
            <UButton
              to="/profile"
              variant="ghost"
              class="justify-start"
              @click="isMenuOpen = false"
            >
              <!-- <UAvatar
                src="/api/placeholder/32/32"
                alt="User avatar"
                class="mr-2"
              /> -->
              My Profile
            </UButton>
            <UButton
              variant="ghost"
              class="justify-start text-red-600 dark:text-red-400"
              @click="logout"
            >
              <UIcon name="i-heroicons-arrow-left-on-rectangle" class="mr-2" />
              Logout
            </UButton>
          </template>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const links = [
  { name: 'Dashboard', path: '/dashboard', icon: 'i-heroicons-home' },
  { name: 'Batches', path: '/batches', icon: 'i-heroicons-beaker' },
  { name: 'Recipes', path: '/recipes', icon: 'i-heroicons-book-open' },
/*   { name: 'Community', path: '/community', icon: 'i-heroicons-users' },
 */]

const isMenuOpen = ref(false)
const isLoggedIn = ref(false) // Replace with actual auth state

const logout = () => {
  // Implement logout logic here
  isMenuOpen.value = false
}
</script>