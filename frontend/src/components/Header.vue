<script setup>
import { useTheme } from 'vuetify'
import { authStore } from "@/stores/auth.js"
import { computed } from "vue"
import ProfileMenu from "@/components/ProfileMenu.vue"
import router from "@/router/index.js"


const auth = authStore()

const theme = useTheme()
const currentTheme = computed(() => {
  return theme.global.current.value.dark ? 'dark' : 'light'
})


function UpdateTheme()
{
  try
  {
    if(currentTheme.value === 'dark')
    {
      auth.UpdateUserProfile({ theme: 'dark' })
    }
    else
    {
      auth.UpdateUserProfile({ theme: 'light' })
    }
  }
  catch(error)
  {
    console.error(error)
  }
}
</script>

<template>
  <VAppBar
      class="appbar-overlay"
      flat
      height="100"
      app
  >
    <VSpacer />

    <VCard
        class="d-flex align-center gap-2 pa-2"
        style="width: 60vw"
    >
      <div class="d-flex justify-center img-div" @click="router.push('/')">
        <img src="../icons/Logo.png" style="width: 46px" />
      </div>

      <VSpacer />

      <VMenu
          offset="20"
          location="bottom end"
      >
        <template v-slot:activator="{ props }">
          <VBtn
              icon
              v-bind="props"
          >
            <VIcon>
              mdi-web
            </VIcon>
          </VBtn>
        </template>

        <VList width="100" class="pa-0">
          <VListItem>
            <VListItemTitle>Ru</VListItemTitle>
          </VListItem>

          <VListItem>
            <VListItemTitle>En</VListItemTitle>
          </VListItem>
        </VList>
      </VMenu>

      <VBtn
          icon
          @click="() => { theme.toggle(); UpdateTheme() }"
      >
        <VIcon>
          {{
            currentTheme === 'light' ?
            'mdi-white-balance-sunny' :
            'mdi-moon-waning-crescent'
          }}
        </VIcon>
      </VBtn>

      <ProfileMenu />
    </VCard>

    <VSpacer />
  </VAppBar>
</template>

<style scoped>
.appbar-overlay
{
  background-color: transparent !important;
  box-shadow: none !important;
  pointer-events: none;
}

.appbar-overlay > *
{
  pointer-events: auto;
}

.img-div
{
  transition: transform 0.2s ease;
}

.img-div:hover
{
  transform: scale(1.1);
}

.img-div:active
{
  transform: scale(1);
}

.v-list
{
  border-radius: 10px !important;
}
</style>