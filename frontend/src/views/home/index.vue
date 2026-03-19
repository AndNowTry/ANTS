<script setup>
import router from "@/router/index.js";
import { computed } from "vue"
import { useTheme } from "vuetify/framework"
import { authStore } from "@/stores/auth.js"


import fileWired from '@/icons/file-wired.svg'
import fileWiredWhite from '@/icons/file-wired-white.svg'
import fileDashedLine from '@/icons/file-dashed-line.svg'
import fileDashedLineWhite from '@/icons/file-dashed-line-white.svg'


const auth = authStore()
const theme = useTheme()


const hasAccess = computed(() =>
    ['api', 'professional'].includes(auth?.userInfo?.level)
)

const currentTheme = computed(() => {
  return theme.global.current.value.dark ? 'dark' : 'light'
})
</script>


<template>
  <div class="d-flex justify-center align-center" style="height: 100%">
    <VRow class="pa-4" style="width: 100%; max-width: 700px;">
      <VCol cols="12" sm="6">
        <VCard
            class="payment-card"
            rounded="lg"
            to="conversion"
            elevation="2"
        >
          <VCardText class="d-flex flex-column align-center pa-8 ga-4">
            <div @click.stop="router.push('/')">
              <img
                  :src="currentTheme === 'light' ? fileDashedLine : fileDashedLineWhite"
                  style="width: 160px; display: block"
              />
            </div>

            <div class="text-center">
              <div class="text-overline text-medium-emphasis mb-1">Plan</div>

              <h2 class="text-h5 font-weight-bold">Conversion</h2>
            </div>

            <VDivider class="w-100" />

            <div class="w-100 d-flex flex-column ga-2">
              <div class="d-flex align-center ga-3">
                <VIcon icon="mdi-check-circle-outline" size="18" />

                <span class="text-body-2">Conversion using the interface</span>
              </div>

              <div class="d-flex align-center ga-3">
                <VIcon icon="mdi-check-circle-outline" size="18" />

                <span class="text-body-2">Convert up to 5 files in parallel</span>
              </div>
            </div>

          </VCardText>
        </VCard>
      </VCol>

      <VCol cols="12" sm="6">
        <VHover v-slot="{ isHovering, props }">
          <VCard
              class="payment-card"
              rounded="lg"
              v-bind="props"
              :to="hasAccess ? 'conversion' : undefined"
              :elevation="isHovering ? 6 : 2"
              style="transition: box-shadow 0.2s ease"
          >
            <VCardText class="d-flex flex-column align-center pa-8 ga-4">
              <div @click.stop="router.push('/')">
                <img
                    :src="currentTheme === 'light' ? fileWired : fileWiredWhite"
                    style="width: 160px; display: block"
                />
              </div>

              <div class="text-center">
                <div class="text-overline text-medium-emphasis mb-1">Plan</div>

                <h2 class="text-h5 font-weight-bold">API Conversion</h2>
              </div>

              <VDivider class="w-100" />

              <div class="w-100 d-flex flex-column ga-2">
                <div class="d-flex align-center ga-3">
                  <VIcon icon="mdi-check-circle-outline" size="18" />

                  <span class="text-body-2">Conversion using API</span>
                </div>

                <div class="d-flex align-center ga-3">
                  <VIcon icon="mdi-check-circle-outline" size="18" />

                  <span class="text-body-2">Convert up to 5 files in parallel</span>
                </div>
              </div>
            </VCardText>

            <VOverlay
                v-if="!hasAccess"
                :model-value="!!isHovering"
                class="align-center justify-center"
                scrim="grey-darken-2"
                :opacity="0.7"
                contained
            >
              <div class="text-center pa-4">
                <VIcon icon="mdi-lock-outline" color="yellow" size="32" class="mb-3" />

                <div>
                  <VBtn color="yellow" variant="flat" rounded="pill" size="small">
                    Buy API or Professional
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