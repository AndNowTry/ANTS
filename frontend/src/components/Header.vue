<script setup>
import { useTheme } from 'vuetify'
import { computed } from "vue"
import { UpdateProfile } from "@/utils/update_profile.js"

import ProfileMenu from "@/components/ProfileMenu.vue"
import router from "@/router/index.js";


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
      UpdateProfile({ theme: 'dark' })
    }
    else
    {
      UpdateProfile({ theme: 'light' })
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
  >
    <VSpacer />

    <VCard
        class="d-flex align-center gap-3 pa-2"
        style="width: 60vw"
    >
      <div class="d-flex justify-center" @click="router.push('/')">
        <img src="../icons/Logo.png" style="width: 46px" />
      </div>

      <VSpacer />

      <VBtn
          icon
          @click="() => {theme.toggle(); UpdateTheme()}"
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
</style>