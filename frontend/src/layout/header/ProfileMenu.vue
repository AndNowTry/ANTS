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
      <VAvatar
          v-bind="props"
          :badge="auth.access === 'professional' || auth.access === 'api'
          ? {
              color: 'yellow-accent-2',
              location: 'bottom',
              bordered: false,
          } : undefined"
      >
        <template
            v-if="auth.access === 'professional' || auth.access === 'api'"
            v-slot:badge
        >
          {{ auth.access === 'professional' ? 'pro' : 'api' }}
        </template>

        <VImg
            :src="auth.avatar"
            cover
        />
      </VAvatar>
    </template>

    <VList>
      <VListItem style="margin-left: 1px">
        <template #prepend>
          <VAvatar
              size="36"
              :badge="auth.access === 'professional' || auth.access === 'api'
              ? {
                  color: 'yellow-accent-2',
                  location: 'bottom',
                  bordered: false,
              } : undefined"
          >
            <template
                v-if="auth.access === 'professional' || auth.access === 'api'"
                v-slot:badge
            >
              {{ auth.access === 'professional' ? 'pro' : 'api' }}
            </template>

            <VImg
                :src="auth.avatar"
                cover
            />
          </VAvatar>
        </template>

        <VListItemTitle>
          {{ auth.info.username }}
        </VListItemTitle>

        <VListItemSubtitle>
          {{ auth.info.email }}
        </VListItemSubtitle>
      </VListItem>

      <VListItem @click="auth.isProfileSidebarOpen = !auth.isProfileSidebarOpen">
        <template #prepend>
          <VIcon
              size="22"
              icon="mdi-account"
          />
        </template>

        <VListItemTitle>
          {{ t('Profile') }}
        </VListItemTitle>
      </VListItem>

      <VListItem @click="auth.LogoutUser(true)">
        <template #prepend>
          <VIcon
              size="22"
              icon="mdi-logout"
          />
        </template>

        <VListItemTitle>
          {{ t('Logout') }}
        </VListItemTitle>
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

    <VList width="200">
      <VListItem @click="auth.OpenLoginForm">
        <template #prepend>
          <VIcon size="22" icon="mdi-login" />
        </template>
        <VListItemTitle>{{ t('Login') }}</VListItemTitle>
      </VListItem>
    </VList>
  </VMenu>
</template>

