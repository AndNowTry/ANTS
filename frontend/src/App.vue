<script setup>
import { onBeforeUnmount, onMounted } from "vue"
import { authStore } from "@/stores/auth.js"
import { historyStore } from "@/stores/history.js"
import { useTheme } from "vuetify/framework"
import 'vue3-perfect-scrollbar/style.css';

import LoginDialog from "@/components/LoginDialog.vue"
import RegisterDialog from "@/components/RegisterDialog.vue"

import Header from "@/components/Header.vue"
import Footer from "@/components/Footer.vue"
import ProfileSidebar from "@/components/ProfileSidebar.vue"
import HistorySidebar from "@/components/HistorySidebar.vue"
import ToTop from "@/components/ToTop.vue"


const auth = authStore()
const theme = useTheme()
const history = historyStore()


onMounted(async () => {
  try
  {
    await auth.GetUserProfile()

    theme.change(auth.userInfo.theme)

    await history.UpdateAllHistory()
  }
  catch(error)
  {
    console.error(error)
  }
})


onBeforeUnmount(async () => {
  try
  {
    if(!auth.keepUserLoggedIn)
    {
      await auth.LogoutUser()
    }
  }
  catch(error)
  {
    console.error(error)
  }
})
</script>



<template>
  <VResponsive>
    <VApp>
      <LoginDialog />
      <RegisterDialog />

      <HistorySidebar />

      <ProfileSidebar />

      <Header />

      <VMain>
        <RouterView />
      </VMain>

      <ToTop />

      <Footer />
    </VApp>
  </VResponsive>
</template>



