<template>
  <VFooter
      class="appbar-overlay"
      flat
      style="max-height: 100px"
      app
  >
    <VSpacer />

    <VCard
        class="d-flex align-center gap-3 pa-2 mt-3 mb-2"
        style="width: 60vw"
    >
      <h3 class="ma-2">
        Created by And Now @2026
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