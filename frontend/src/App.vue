<script setup>
import { onBeforeUnmount, onMounted } from "vue"
import { authStore } from "@/stores/auth.js"
import { useTheme } from "vuetify/framework"
import axios from "@/axios/axios.js"

import LoginDialog from "@/components/auth/LoginDialog.vue"
import RegisterDialog from "@/components/auth/RegisterDialog.vue"

import Header from "@/components/app/header/Header.vue"
import Sidebar from "@/components/app/sidebar/Sidebar.vue"


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

      <Sidebar />

      <Header />

      <VMain>
        <RouterView />
      </VMain>
    </VApp>
  </VResponsive>
</template>


