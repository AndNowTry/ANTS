import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/home/Home.vue'),
    },
          /*
    {
      path: '/settings',
      name: 'home',
      component: () => import('./views/Settings.vue'),
    }
    */
  ],
})
export default router
