<script setup>
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
</script>

<template>
  <VFooter
      class="appbar-overlay"
      flat
      style="max-height: 100px"
      app
  >
    <VSpacer />

    <VCard
        class="d-flex align-center gap-3 pa-4 mt-3 mb-2"
        style="width: 60vw"
    >
      <span>
        {{ t('Created by') }} <strong>And Now</strong> © 2026
      </span>

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