<script setup>
import { authStore } from "@/stores/auth.js"
import { computed } from "vue"
import axios from "@/axios/axios.js"

const auth = authStore()

const userInfo = computed(() =>
{
  if(!auth.isUserAuthenticated) return null

  return auth.userInfo
})

const profileMenu = {
  'Profile': {
    icon: 'mdi-account',
    link: '/profile',
  },
  'Settings': {
    icon: 'mdi-cog',
    link: '/settings',
  },
}


async function Logout()
{
  try
  {
    const LogoutResponse = await axios.post("/auth/logout/")

    if (LogoutResponse.data.status === "success")
    {
      auth.DeleteUserInfo()
    }
  }
  catch(error)
  {
    console.error(error)
  }
}
</script>

<template>
  <VMenu
      v-if="userInfo"
      offset="20"
      location="bottom end"
  >
    <template v-slot:activator="{ props }">
      <v-avatar v-bind="props">
        <v-img :src="'http://localhost:8000/' + userInfo.avatar" cover></v-img>
      </v-avatar>
    </template>

    <VList width="200">
      <VListItem>
        <template #prepend>
          <v-avatar size="32">
            <v-img :src="'http://localhost:8000/' + userInfo.avatar" cover></v-img>
          </v-avatar>
        </template>
        <VListItemTitle>{{ userInfo.username }}</VListItemTitle>
        <VListItemSubtitle>{{ userInfo.email }}</VListItemSubtitle>
      </VListItem>

      <VListItem
          v-for="(value, key) in profileMenu"
          :key="key"
          :to="value.link"
      >
        <template #prepend>
          <VIcon size="22" :icon="value.icon" />
        </template>
        <VListItemTitle>{{ key }}</VListItemTitle>
      </VListItem>

      <VListItem @click="Logout">
        <template #prepend>
          <VIcon size="22" icon="mdi-logout" />
        </template>
        <VListItemTitle>Logout</VListItemTitle>
      </VListItem>
    </VList>
  </VMenu>



  <VAvatar
      v-else
      icon="mdi-login"
      variant="outlined"
      @click="auth.OpenLoginForm"
  />
</template>


<style scoped>
.v-list
{
  border-radius: 10px !important;
}
</style>