<script setup>
import { authStore } from "@/stores/auth.js"
import { themeStore } from "@/stores/theme.js"
import { useI18n } from 'vue-i18n'
const { t } = useI18n()


import fileWired from '@/icons/file-wired.svg'
import fileWiredWhite from '@/icons/file-wired-white.svg'
import filesBlack from '@/icons/files-black.svg'
import filesWhite from '@/icons/files-white.svg'


const auth = authStore()
const theme = themeStore()
</script>


<template>
  <div
      class="d-flex justify-center align-center"
      style="height: 100%"
  >
    <VRow class="pa-4" style="width: 100%; max-width: 700px;">
      <VCol cols="12" sm="6">
        <VCard
            :disabled="auth.access === 'professional'"
            class="payment-card"
            rounded="lg"
            to="/conversion"
            elevation="2"
        >
          <VCardText class="d-flex flex-column align-center pa-8 ga-4">
            <div>
              <img
                  :src="theme.current === 'light' ? filesBlack : filesWhite"
                  style="width: 160px; display: block"
              />
            </div>

            <div class="text-center">
              <div class="text-overline text-medium-emphasis mb-1">{{ t('Plan') }}</div>

              <h2 class="text-h5 font-weight-bold">{{ t('Professional') }}</h2>
            </div>

            <VDivider class="w-100" />

            <div class="w-100 d-flex flex-column ga-2">
              <div class="d-flex align-center ga-3">
                <VIcon icon="mdi-check-circle-outline" size="18" />

                <span class="text-body-2">{{ t('Conversion using the interface') }}</span>
              </div>

              <div class="d-flex align-center ga-3">
                <VIcon icon="mdi-check-circle-outline" size="18" />

                <span class="text-body-2">{{ t('Convert up to 5 files in parallel') }}</span>
              </div>

              <div class="d-flex align-center ga-3">
                <VIcon icon="mdi-check-circle-outline" size="18" />

                <span class="text-body-2">{{ t('Convert up to 5 files up to 100 MB') }}</span>
              </div>
            </div>

          </VCardText>
        </VCard>
      </VCol>

      <VCol cols="12" sm="6">
        <VCard
            :disabled="auth.access === 'api'"
            class="payment-card"
            rounded="lg"
            to="/conversion"
            elevation="2"
        >
          <VCardText class="d-flex flex-column align-center pa-8 ga-4">
            <div>
              <img
                  :src="theme.current === 'light' ? fileWired : fileWiredWhite"
                  style="width: 160px; display: block"
              />
            </div>

            <div class="text-center">
              <div class="text-overline text-medium-emphasis mb-1">{{ t('Plan') }}</div>

              <h2 class="text-h5 font-weight-bold">{{ t('API') }}</h2>
            </div>

            <VDivider class="w-100" />

            <div class="w-100 d-flex flex-column ga-2">
              <div class="d-flex align-center ga-3">
                <VIcon icon="mdi-check-circle-outline" size="18" />

                <span class="text-body-2">{{ t('Conversion using the API') }}</span>
              </div>

              <div class="d-flex align-center ga-3">
                <VIcon icon="mdi-check-circle-outline" size="18" />

                <span class="text-body-2">{{ t('Convert up to 5 files in parallel') }}</span>
              </div>

              <div class="d-flex align-center ga-3">
                <VIcon icon="mdi-check-circle-outline" size="18" />

                <span class="text-body-2">{{ t('Convert up to 5 files up to 100 MB') }}</span>
              </div>
            </div>

          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </div>
</template>


<style scoped>
.payment-card
{
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;
}

.payment-card:hover
{
  transform: scale(1.05);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.payment-card:active
{
  transform: scale(1);
}
</style>