<script setup>
import { authStore } from "@/stores/auth.js"
import { themeStore } from "@/stores/theme.js"
import { useI18n } from 'vue-i18n'


import fileWired from '@/icons/file-wired.svg'
import fileWiredWhite from '@/icons/file-wired-white.svg'
import fileDashedLine from '@/icons/file-dashed-line.svg'
import fileDashedLineWhite from '@/icons/file-dashed-line-white.svg'
import router from "@/router/index.js";


const auth = authStore()
const theme = themeStore()
const { t } = useI18n()
</script>


<template>
  <div
      class="d-flex justify-center align-center"
      style="height: 100%"
  >
    <VRow class="pa-4" style="width: 100%; max-width: 700px;">
      <VCol cols="12" sm="6">
        <VCard
            class="payment-card border"
            rounded="lg"
            elevation="2"
            to="/conversion"
        >
          <VCardTitle class="pb-0 pt-4 d-flex justify-start">
            <VTooltip
                interactive
                location="bottom start"
            >
              <template v-slot:activator="{ props }">
                <VIcon
                    size="26"
                    color="primary"
                    v-bind="props"
                >
                  mdi-information-outline
                </VIcon>
              </template>

              <div>
                {{ t('Convert files using the interface') }}
              </div>
            </VTooltip>
          </VCardTitle>

          <VCardText class="d-flex flex-column align-center pa-8 pt-0 ga-4">
            <div>
              <img
                  :src="theme.current === 'light' ? fileDashedLine : fileDashedLineWhite"
                  style="width: 200px; display: block"
              />
            </div>

            <div class="text-center">
              <h2 class="text-h5 font-weight-bold">{{ t('Conversion') }}</h2>
            </div>

          </VCardText>
        </VCard>
      </VCol>

      <VCol cols="12" sm="6">
        <VHover v-slot="{ isHovering, props }">
          <VCard
              class="payment-card border"
              rounded="lg"
              v-bind="props"
              :elevation="isHovering ? 6 : 2"
              style="transition: box-shadow 0.1s ease, background-color 0.2s ease, color 0.3s ease"
              :to="auth.access !== 'api' ? '/user-plans' : '/api/conversion'"
          >
            <VCardTitle class="pb-0 pt-4 d-flex justify-start">
              <VTooltip
                  interactive
                  location="bottom start"
              >
                <template v-slot:activator="{ props }">
                  <VIcon
                      size="26"
                      color="primary"
                      v-bind="props"
                  >
                    mdi-information-outline
                  </VIcon>
                </template>

                <div>
                  {{ t('Convert files using the API') }}
                </div>
              </VTooltip>
            </VCardTitle>

            <VCardText class="d-flex flex-column align-center pa-8 pt-0 ga-4">
              <div>
                <img
                    :src="theme.current === 'light' ? fileWired : fileWiredWhite"
                    style="width: 200px; display: block"
                />
              </div>

              <div class="text-center">
                <h2 class="text-h5 font-weight-bold">{{ t('API Conversion') }}</h2>
              </div>
            </VCardText>

            <VOverlay
                v-if="auth.access !== 'api'"
                :model-value="!!isHovering"
                class="align-center justify-center"
                scrim="grey-darken-2"
                :opacity="0.7"
                contained
            >
              <div class="text-center pa-4">
                <VIcon icon="mdi-lock-outline" color="primary" size="32" class="mb-3" />

                <div>
                  <VBtn color="primary" variant="flat" rounded="pill" size="small">
                    {{ t('Buy API') }}
                  </VBtn>
                </div>
              </div>
            </VOverlay>
          </VCard>
        </VHover>
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