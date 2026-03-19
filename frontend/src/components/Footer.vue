<script setup>
import router from "@/router/index.js";
import ProfileMenu from "@/components/ProfileMenu.vue";
</script>

<template>
  <VFooter
      class="appbar-overlay"
      style="max-height: 100px">
    <VSpacer />

    <VCard
        class="d-flex align-center gap-3 pa-2"
        style="width: 60vw"
    >
      <h3 class="ma-2">
        ANTS
      </h3>

    </VCard>

    <VSpacer />
  </VFooter>
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