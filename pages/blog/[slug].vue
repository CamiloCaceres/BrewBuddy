<template>
  <div class="px-4 py-8">
    <div v-if="isPending" class="space-y-6">
      <USkeleton class="h-12 w-3/4" />
      <div class="space-y-4">
        <USkeleton class="h-4 w-full" v-for="i in 5" :key="i" />
        <USkeleton class="h-4 w-2/3" />
      </div>
    </div>
    
    <UAlert
      v-else-if="isError"
      color="red"
      title="Error"
      :description="error?.message"
      class="my-4"
    />
    
    <article v-else class="rounded-lg overflow-hidden">
      <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4 p-4">
        {{ data?.title }}
      </h1>
      <div class="p-6 md:p-8">
        <div class="prose md:prose-lg max-w-none" v-html="data?.content"></div>
      </div>
      
      <div class="bg-gray-100 px-6 py-4 md:px-8 md:py-6">
        <div class="flex flex-wrap items-center text-sm text-gray-600">
          <p class="mr-4 mb-2 md:mb-0">
            <span class="font-semibold">Author:</span> {{ data?.expand?.author?.name }}
          </p>
          <p>
            <span class="font-semibold">Published:</span> {{ formatDate(data?.published_date) }}
          </p>
        </div>
      </div>
    </article>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { usePocketBase } from "@/composables/usePocketBase";
import { useQuery } from "@tanstack/vue-query";

const { getPostBySlug } = usePocketBase();

const route = useRoute();
const slug = route.params.slug as string;

const { data, isPending, isError, error } = useQuery({
  queryKey: ["post", slug],
  queryFn: () => getPostBySlug(slug),
});

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};
</script>
