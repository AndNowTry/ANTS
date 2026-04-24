<script setup>
import { onBeforeUnmount, onMounted, ref } from "vue"
import { authStore } from "@/stores/auth.js"
import { toastStore } from "@/stores/toastes.js"
import 'vue3-perfect-scrollbar/style.css'


import LoginDialog from "@/layout/main/LoginDialog.vue"
import RegisterDialog from "@/layout/main/RegisterDialog.vue"


import Header from "@/layout/header/Header.vue"
import Footer from "@/layout/footer/Footer.vue"
import ProfileSidebar from "@/layout/right_sidebar/ProfileSidebar.vue"
import AdSidebar from "@/layout/right_sidebar/AdSidebar.vue"
import HistorySidebar from "@/layout/left_sidebar/HistorySidebar.vue"
import ToTop from "@/layout/main/ToTop.vue"


const auth = authStore()
const toastes = toastStore()


const snackbarQueue = ref()


onMounted(() => {
  window.addEventListener('beforeunload', handleUnload)
})

onBeforeUnmount(() => {
  window.removeEventListener('beforeunload', handleUnload)
})

function handleUnload()
{
  if (!auth.keepUserLoggedIn)
  {
    const csrfToken = document.cookie
        .split('; ')
        .find(row => row.startsWith('csrftoken='))
        ?.split('=')[1]

    const blob = new Blob(
        [JSON.stringify({})],
        { type: 'application/json' }
    )

    navigator.sendBeacon('http://localhost:8000/api/auth/logout/', blob)
  }
}
</script>



<template>
  <VResponsive>
    <VApp>
      <LoginDialog />
      <RegisterDialog />

      <HistorySidebar />

      <ProfileSidebar />

      <AdSidebar />

      <Header />

      <VMain>
        <RouterView />
      </VMain>

      <ToTop />

      <VSnackbarQueue
          ref="snackbarQueue"
          v-model="toastes.messages"
          :total-visible="3"
          variant="outlined"
      />

      <Footer />
    </VApp>
  </VResponsive>
</template>



