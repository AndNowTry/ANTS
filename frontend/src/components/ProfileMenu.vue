<script setup>
import { authStore } from "@/stores/auth.js"
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const auth = authStore()
</script>


<template>
  <VMenu
      v-if="auth?.info?.username"
      offset="20"
      location="bottom end"
  >
    <template v-slot:activator="{ props }">
      <v-avatar v-bind="props">
        <v-img :src="auth.avatar" cover></v-img>
      </v-avatar>
    </template>

    <VList
        width="200"
        class="pa-0"
    >
      <VListItem>
        <template #prepend>
          <v-avatar size="32">
            <v-img :src="auth.avatar" cover></v-img>
          </v-avatar>
        </template>
        <VListItemTitle>{{ auth.info.username }}</VListItemTitle>
        <VListItemSubtitle>{{ auth.info.email }}</VListItemSubtitle>
      </VListItem>

      <VListItem @click="auth.isProfileSidebarOpen = !auth.isProfileSidebarOpen">
        <template #prepend>
          <VIcon size="22" icon="mdi-account" />
        </template>
        <VListItemTitle>{{ t('Profile') }}</VListItemTitle>
      </VListItem>

      <VListItem @click="auth.LogoutUser(true)">
        <template #prepend>
          <VIcon size="22" icon="mdi-logout" />
        </template>
        <VListItemTitle>{{ t('Logout') }}</VListItemTitle>
      </VListItem>
    </VList>
  </VMenu>

  <VMenu
      v-else
      offset="20"
      location="bottom end"
  >
    <template v-slot:activator="{ props }">
      <v-avatar v-bind="props">
        <v-img :src="auth.avatar" cover></v-img>
      </v-avatar>
    </template>

    <VList
        width="200"
        class="pa-0"
    >
      <VListItem @click="auth.OpenLoginForm">
        <template #prepend>
          <VIcon size="22" icon="mdi-login" />
        </template>
        <VListItemTitle>{{ t('Login') }}</VListItemTitle>
      </VListItem>
    </VList>
  </VMenu>
</template>


<style scoped>
.v-list
{
  border-radius: 10px !important;
}
</style>