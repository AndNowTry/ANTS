<script setup>
import { onBeforeUnmount, onMounted } from "vue"
import { authStore } from "@/stores/auth.js"
import { useTheme } from "vuetify/framework"
import axios from "@/axios/axios.js"

import LoginDialog from "@/components/LoginDialog.vue"
import RegisterDialog from "@/components/RegisterDialog.vue"

import Header from "@/components/Header.vue"
import Footer from "@/components/Footer.vue"
import ProfileSidebar from "@/components/ProfileSidebar.vue";
import HistorySidebar from "@/components/HistorySidebar.vue";


const auth = authStore()
const theme = useTheme()


onMounted(async () => {
  try
  {
    const ProfileResponse = await axios.get("/auth/profile/")

    if (ProfileResponse.data.status === "success")
    {
      auth.SaveUserInfo( ProfileResponse.data.data.data )

      theme.change(auth.userInfo.theme)
    }
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
      const LogoutResponse = await axios.post("/auth/logout/")

      if (LogoutResponse.data.status === "success")
      {
        auth.DeleteUserInfo()
      }
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

      <Footer />
    </VApp>
  </VResponsive>
</template>


