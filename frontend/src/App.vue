<script setup>
import { onBeforeMount, onBeforeUnmount, ref } from "vue"
import { authStore } from "@/stores/auth.js"
import { historyStore } from "@/stores/history.js"
import { toastStore } from "@/stores/toastes.js"
import { themeStore } from "@/stores/theme.js"
import { languageStore } from "@/stores/language.js"
import 'vue3-perfect-scrollbar/style.css'


import LoginDialog from "@/components/LoginDialog.vue"
import RegisterDialog from "@/components/RegisterDialog.vue"

import Header from "@/components/Header.vue"
import Footer from "@/components/Footer.vue"
import ProfileSidebar from "@/components/ProfileSidebar.vue"
import HistorySidebar from "@/components/HistorySidebar.vue"
import ToTop from "@/components/ToTop.vue"


const auth = authStore()
const theme = themeStore()
const language = languageStore()
const history = historyStore()
const toastes = toastStore()


const snackbarQueue = ref()


onBeforeMount(async () => {
  try
  {
    theme.InitTheme()
    language.InitLanguage()

    await auth.GetUserProfile()
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



