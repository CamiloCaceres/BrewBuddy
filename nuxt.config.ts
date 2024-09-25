// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@nuxt/ui"],
  compatibilityDate: "2024-09-23",
  runtimeConfig: {
    public: {
      pocketbaseUrl: process.env.POCKETBASE_URL
    }
  }
})