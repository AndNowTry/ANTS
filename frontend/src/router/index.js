import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/home/index.vue'),
    },
    {
      path: '/conversion',
      name: 'conversion',
      component: () => import('@/views/conversion/index.vue'),
    }
  ],
})
export default router
