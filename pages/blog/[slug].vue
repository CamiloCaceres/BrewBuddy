<script setup lang="ts">
import { useRoute } from 'vue-router'
import { ref } from 'vue'
import { usePocketBase } from '@/composables/usePocketBase'

const { getPostBySlug } = usePocketBase()

const route = useRoute()
const slug = route.params.slug as string
const post = ref<any>(null)
const loading = ref(true)

const fetchPost = async () => {
  loading.value = true
  try {
    post.value = await getPostBySlug(slug)
  } catch (error) {
    console.error('Error fetching post:', error)
  } finally {
    loading.value = false
  }
}

// Fetch the post when the component is created
fetchPost()
</script>

<template>
  <UContainer class="max-w-3xl mx-auto mt-8">
    <template v-if="loading">
      <UCard class="mb-4">
        <template #header>
          <USkeleton class="h-10 w-3/4 mb-4" />
        </template>
        <template #default>
          <div class="space-y-4">
            <USkeleton class="h-4 w-full" v-for="i in 5" :key="i" />
            <USkeleton class="h-4 w-2/3" />
          </div>
        </template>
        <template #footer>
          <div class="mt-8 space-y-2">
            <USkeleton class="h-4 w-1/3" />
            <USkeleton class="h-4 w-1/4" />
          </div>
        </template>
      </UCard>
    </template>

    <UCard v-else-if="post" class="mb-4">
      <template #header>
        <h1 class="text-4xl font-bold">{{ post.title }}</h1>
      </template>
      <template #default>
        <div class="prose max-w-none" v-html="post.content"></div>
      </template>
      <template #footer>
        <div class="mt-8 text-gray-600">
          <p>Author: {{ post.expand?.author?.name }}</p>
          <p>Published: {{ new Date(post.published_date).toLocaleDateString() }}</p>
        </div>
      </template>
    </UCard>
    <div v-else>
      <p>Error loading post. Please try again later.</p>
    </div>
  </UContainer>
</template>