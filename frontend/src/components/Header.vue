<script setup>
import ProfileMenu from "@/components/ProfileMenu.vue"
import LanguageMenu from "@/components/LanguageMenu.vue"
import ThemeMenu from "@/components/ThemeMenu.vue"


import router from "@/router/index.js"


async function GoHome(){await router.push('/')}
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
      <div class="d-flex justify-center img-div" @click="GoHome">
        <img src="../icons/Logo.png" style="width: 46px" />
      </div>

      <VSpacer />

      <LanguageMenu />

      <ThemeMenu />

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
</style>