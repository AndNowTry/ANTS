<script setup>
import { themeStore } from "@/stores/theme.js"

const theme = themeStore()
</script>

<template>
  <VBtn
      icon
      @click="theme.UpdateTheme(theme.current === 'light' ? 'dark' : 'light', true)"
  >
    <VIcon>
      {{ theme.current === 'light' ? 'mdi-white-balance-sunny' : 'mdi-moon-waning-crescent'}}
    </VIcon>
  </VBtn>
</template>

