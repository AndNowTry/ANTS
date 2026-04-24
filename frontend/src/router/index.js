import { createRouter, createWebHistory } from 'vue-router'
import { authStore } from "@/stores/auth.js"


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('@/views/Home/index.vue'),
    },
    {
      path: '/conversion',
      name: 'Conversion',
      component: () => import('@/views/UIConversion/index.vue'),
    },
    {
      path: '/api/conversion',
      name: 'ApiConversion',
      component: () => import('@/views/ApiConversion/index.vue'),
      meta: { access: ['api'] },
    },
    {
      path: '/api/conversion/documentation',
      name: 'ApiDocumentation',
      component: () => import('@/views/ApiDocumentation/index.vue'),
      meta: { access: ['api'] },
    },
    {
      path: '/user-plans',
      name: 'UserPlans',
      component: () => import('@/views/UserPlans/index.vue'),
      meta: { access: ['user', 'professional', 'api'] },
    },
    {
      path: '/payment/:plan',
      name: 'Payment',
      component: () => import('@/views/Payment/index.vue'),
      meta: { access: ['user', 'professional', 'api'] },
    },
    {
      path: '/404',
      name: 'EmptyState',
      component: () => import('@/views/EmptyState/index.vue'),
    },
  ],
})



router.beforeEach(async to => {
  const auth = authStore()

  if(!router.resolve(to.path).matched.length)
  {
    return '/404'
  }

  if(to.meta.access)
  {
    try
    {
      await auth.GetUserProfile(true)
    }
    catch (error)
    {
      if(error.response?.status === 401)
      {
        try
        {
          await auth.RefreshToken()
          await auth.GetUserProfile(true)
        }
        catch (e)
        {
          auth.OpenLoginForm()
          return '/'
        }
      }
      else
      {
        return '/'
      }
    }

    if(auth.access === 'guest')
    {
      auth.OpenLoginForm()
      return '/'
    }

    if(!to.meta.access.includes(auth.access))
    {
      return '/'
    }

    return true
  }

  return true
})


export default router
