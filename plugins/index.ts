import { VueQueryPlugin } from '@tanstack/vue-query'
import { autoAnimatePlugin } from '@formkit/auto-animate/vue'
import VCalendar from 'v-calendar';
import 'v-calendar/style.css';

export default defineNuxtPlugin((app) => {
  app.vueApp.use(VueQueryPlugin)
  app.vueApp.use(autoAnimatePlugin)
  app.vueApp.use(VCalendar, {})
})