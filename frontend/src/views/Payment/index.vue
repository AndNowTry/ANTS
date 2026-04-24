<script setup>
import { authStore } from "@/stores/auth.js"
import { useI18n } from 'vue-i18n'
import { ref, computed } from "vue"
import { useRoute, useRouter } from "vue-router"
import axios from "@/axios/axios.js"

const { t }  = useI18n()
const auth   = authStore()
const route  = useRoute()
const router = useRouter()

const loading = ref(false)
const error   = ref(null)

const PLAN_PRICES = {
  professional: "$9.99 /",
  api: "$7.99 /",
}

const plan  = computed(() => route.params.plan)
const price = computed(() => PLAN_PRICES[plan.value] ?? "—")

const paymentOptions = ref({
  current: 'visa',
  options: {
    sbp: {
      icon: new URL('@/icons/sbp.png', import.meta.url).href,
      name: 'СПБ',
    },
    kiwi: {
      icon: new URL('@/icons/kiwi.png', import.meta.url).href,
      name: 'QIWI',
    },
    visa: {
      icon: new URL('@/icons/visa.png', import.meta.url).href,
      name: 'Visa',
    },
  }
})

const selectedMethod = computed(() => paymentOptions.value.current)

const card = ref({
  number: '',
  name: '',
  expiry: '',
  cvv: ''
})

async function pay()
{
  if (selectedMethod.value !== 'visa') return

  error.value = null
  loading.value = true

  try
  {
    const res = await axios.post("/payment/", {
      plan: plan.value,
      card_number: card.value.number,
    })

    if (res.data.status === "success")
    {
      await auth.UpdateUserProfile(true)
      await router.push("/")
    }
  }
  catch(e)
  {
    error.value = e.response?.data?.error?.message || "Payment failed"
  }
  finally
  {
    loading.value = false
  }
}
</script>


<template>
  <div
      class="d-flex justify-center align-center"
      style="height: 100%"
  >
    <VCard
        width="600"
        class="border"
    >
      <VCardTitle class="pa-4">
        <div class="text-title-large">
          {{ price + t(' month') }}
        </div>
      </VCardTitle>

      <VCardText>
        <VSlideGroup
            v-model="paymentOptions.current"
            mandatory
            center-active
            show-arrows
            class="pa-2"
        >
          <VSlideGroupItem
              v-for="(option, key) in paymentOptions.options"
              :key="key"
              :value="key"
              v-slot="{ isSelected, toggle }"
          >
            <VCard
                @click="toggle"
                height="100"
                width="210"
                class="ma-2 d-flex flex-column align-center justify-center cursor-pointer"
                :elevation="isSelected ? 8 : 2"
                :variant="isSelected ? 'outlined' : 'flat'"
                style="border-color: chartreuse"
            >
              <img
                  :src="option.icon"
                  width="40"
              />

              <div class="mt-2">
                {{ option.name }}
              </div>
            </VCard>
          </VSlideGroupItem>
        </VSlideGroup>
      </VCardText>

      <VCardText>
        <div v-if="selectedMethod === 'visa'">
          <VAlert
              v-if="error"
              type="error"
              variant="tonal"
              density="compact"
              class="mb-3"
          >
            {{ error }}
          </VAlert>

          <VAlert
              type="info"
              variant="tonal"
              density="compact"
              class="mb-3"
          >
            {{ t('Test mode. Card starting with ') }}<strong>0000</strong>{{ t(' - successful payment.') }}
          </VAlert>

          <VTextField
              v-model="card.number"
              :label="t('Card number')"
              placeholder="0000 1234 5678 9012"
              variant="outlined"
              density="comfortable"
          />
          <VTextField
              v-model="card.name"
              :label="t('Card holder')"
              variant="outlined"
              density="comfortable"
          />
          <div class="d-flex gap-5">
            <VTextField
                v-model="card.expiry"
                :label="t('MM/YY')"
                variant="outlined"
                density="comfortable"
            />

            <VTextField
                v-model="card.cvv"
                label="CVV"
                type="password"
                variant="outlined"
                density="comfortable"
            />
          </div>
        </div>

        <div
            v-else-if="selectedMethod === 'sbp'"
            class="text-center"
        >
          <VIcon size="40">
            mdi-qrcode
          </VIcon>

          <div class="mt-2">
            {{ t('Payment by ') }} СБП
          </div>

          <div class="text-caption">
            {{ t('In plans') }}
          </div>
        </div>

        <div
            v-else-if="selectedMethod === 'kiwi'"
            class="text-center"
        >
          <VIcon size="40">
            mdi-wallet
          </VIcon>

          <div class="mt-2">
            QIWI
          </div>

          <div class="text-caption">
            {{ t('In plans') }}
          </div>
        </div>
      </VCardText>

      <VCardActions>
        <VBtn
            to="/user-plans"
            color="primary"
            variant="flat"
        >
          {{ t('Back to options') }}
        </VBtn>

        <VSpacer />

        <VBtn
            color="success"
            variant="flat"
            :loading="loading"
            :disabled="selectedMethod !== 'visa'"
            @click="pay"
        >
          {{ t('Pay') }}
        </VBtn>
      </VCardActions>

    </VCard>
  </div>
</template>