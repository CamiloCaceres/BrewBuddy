<template>
  <h1 class="text-4xl font-bold my-8">Blog</h1>
  <div v-if="query?.isPending">
    <USkeleton v-for="i in 3" :key="i" class="h-48 mb-4" />
  </div>
  <div v-else-if="query?.error">
    <UAlert color="red" title="Error" :description="query.error" />
  </div>
  <div class="space-y-6" v-else>
    <NuxtLink
      v-for="post in query?.data"
      :key="post.id"
      :to="`/blog/${post.slug}`"
      class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-6 transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg cursor-pointer block md:flex"
    >
      <div class="w-full md:w-1/3 relative">
        <img
          v-if="post.image"
          :src="getImageUrl(post)"
          :alt="post.title"
          class="w-full h-48 md:h-full object-cover"
        />
      </div>
      <div class="w-full md:w-2/3 p-6 flex flex-col justify-between">
        <div>
          <h2 class="text-xl font-semibold mb-2">{{ post.title }}</h2>
          <p class="text-gray-600 dark:text-gray-300">{{ post.excerpt }}</p>
        </div>
        <div class="mt-4 text-sm text-gray-600 dark:text-gray-300 text-right">
          <span class="mr-4">
            <i class="fas fa-user mr-2"></i
            >{{ post.expand?.author?.name || "Unknown Author" }}
          </span>
          <span>
            <i class="fas fa-calendar-alt mr-2"></i
            >{{ new Date(post.published_date).toLocaleDateString() }}
          </span>
        </div>
      </div>
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { usePocketBase } from "@/composables/usePocketBase";
import { useQuery } from "@tanstack/vue-query";

const { getAllPosts, getImageUrl } = usePocketBase();

const query = ref();


onMounted(() => {
  query.value = useQuery({
    queryKey: ["posts"],
    queryFn: () => getAllPosts(),
  });


});
</script>
