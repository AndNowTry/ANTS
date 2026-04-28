<script setup>
import { authStore } from "@/stores/auth.js"
import { useI18n } from 'vue-i18n'
import {computed} from "vue";
const { t } = useI18n()


const auth = authStore()


const userPlans = computed(() => [
  {
    value: 'professional',
    title: t('Professional'),
    description: t('Good for multitasking'),
    to: '/payment/professional',
    price: '$9.99 /',
    improvements: [
      t('Standard user upgrade'),
      t('Improved interface'),
      t('Parallel convert up to 5 files'),
      t('Maximum file size up to 500 MB'),
      t('No ads'),
    ]
  },
  {
    value: 'api',
    title: t('API'),
    description: t('Good for automation'),
    to: '/payment/api',
    price: '$7.99 /',
    improvements: [
      t('Non-standard user upgrade'),
      t('Conversion using the API'),
      t('Convert up to 1 file'),
      t('Maximum file size up to 100 MB'),
      t('No ads'),
    ]
  }
])
</script>


<template>
  <div
      class="d-flex justify-center align-center"
      style="height: 100%"
  >
    <VRow
        class="pa-4"
        style="width: 100%; max-width: 720px;"
    >
      <VCol
          cols="12"
          class="text-center text-headline-large"
      >
        {{ t('Choose your Pricing plan') }}
      </VCol>

      <template
        v-for="option in userPlans"
        :key="option.value"
      >
        <VCol
            cols="12"
            sm="6"
        >
          <VHover v-slot="{ isHovering, props }">
            <VCard
                v-bind="props"
                :disabled="auth.info.subscriptions.find(obj => obj.plan === option.value)"
                class="payment-card border"
                rounded="lg"
                elevation="2"
            >
              <VCardText class="d-flex flex-column pa-5 ga-4">
                <div class="d-flex">
                  {{ option.title }}
                </div>

                <div class="d-flex align-end">
                <span class="text-headline-small">
                  {{ option.price }}
                </span>

                  <span style="margin-bottom: 2px">
                  monthly
                </span>
                </div>

                <div class="d-flex">
                  {{ option.description }}
                </div>

                <VBtn
                  :color="isHovering ? 'success' : 'primary'"
                  class="mt-2 mb-4"
                  :to="option.to"
                >
                  {{ t('Buy') + ' ' + option.title }}
                </VBtn>

                <template v-for="improvement in option.improvements">
                  <div class="d-flex align-center ga-3">
                    <VIcon
                        icon="mdi-check-circle-outline"
                        :color="isHovering ? 'success' : 'info'"
                        size="18"
                    />

                    <span class="text-body-2">
                    {{ improvement }}
                  </span>
                  </div>
                </template>
              </VCardText>
            </VCard>
          </VHover>
        </VCol>
      </template>
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