import { createRouter, createWebHistory } from 'vue-router'
import { authStore } from "@/stores/auth.js"


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
    },
    {
      path: '/api-conversion',
      name: 'api-conversion',
      component: () => import('@/views/api-conversion/index.vue'),
      meta: { access: ['api'] },
    },
    {
      path: '/api-conversion/documentation',
      name: 'api-documentation',
      component: () => import('@/views/api-documentation/index.vue'),
      meta: { access: ['api'] },
    },
    {
      path: '/payment',
      name: 'payment',
      component: () => import('@/views/payment/index.vue'),
      meta: { access: ['user', 'professional', 'api'] },
    },
  ],
})


router.beforeEach(async to => {
  const auth = authStore()

  if(to.meta.access)
  {
    try
    {
      await auth.GetUserProfile(true)

      if(to.meta.access && !to.meta.access.includes(auth.access))
      {
        return '/'
      }

      return true
    }
    catch(error)
    {
      return '/'
    }
  }

  return true
})


export default router
