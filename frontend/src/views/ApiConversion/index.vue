<script setup>
import {computed, onMounted, ref} from "vue"
import axios from "@/axios/axios.js"
import { toastStore } from "@/stores/toastes.js"
import { useI18n } from "vue-i18n"
import { authStore } from "@/stores/auth.js"
import { languageStore } from "@/stores/language.js"
import { themeStore } from "@/stores/theme.js"
const { t } = useI18n()


const auth = authStore()
const token = ref(null)
const loading = ref(false)
const copied = ref(false)
const toastes = toastStore()
const language = languageStore()
const theme = themeStore()


const workPrincipleImg = computed(() => {
  if(language.current === 'en' && theme.current === 'light')
  {
    return new URL('@/icons/work_light_en.PNG', import.meta.url).href
  }
  else if(language.current === 'ru' && theme.current === 'light')
  {
    return new URL('@/icons/work_light_ru.PNG', import.meta.url).href
  }
  else if(language.current === 'ru' && theme.current === 'dark')
  {
    return new URL('@/icons/work_dark_ru.PNG', import.meta.url).href
  }
  else
  {
    return new URL('@/icons/work_dark_en.PNG', import.meta.url).href
  }
})

const hint = computed(() => {
  const sub = auth.info?.subscriptions?.find(s => s.plan === auth.info?.level && s.is_active)
  return sub?.expires_at ? t('Subscription until:') + ' ' + new Date(sub.expires_at).toLocaleString() : undefined
})


async function GetToken()
{
  loading.value = true
  try
  {
    const response = await axios.get("/auth/api-token/")
    token.value = response.data.data.token
  }
  catch(error)
  {
    console.error(error)
  }
  finally
  {
    loading.value = false
  }
}


async function RegenerateToken()
{
  loading.value = true
  try
  {
    const response = await axios.delete("/auth/api-token/")
    token.value = response.data.data.token
    copied.value = false
  }
  catch(error)
  {
    console.error(error)
  }
  finally
  {
    loading.value = false
  }
}


async function CopyToken()
{
  await navigator.clipboard.writeText(token.value)
  copied.value = true
  toastes.AddToast('success', t('Success copied'), 'mdi-check')
  setTimeout(() => copied.value = false, 2000)
}

onMounted(() => {
  GetToken()
})
</script>


<template>
  <div
      class="d-flex justify-center align-center"
      style="height: 100%"
  >
    <VCard width="740">
      <VCardTitle class="mt-2">
        <VChip
            v-if="hint"
            color="info"
        >
          {{ hint }}
        </VChip>
      </VCardTitle>

      <VCardText>
        <img
            :src="workPrincipleImg"
            width="708"
            style="border-radius: 10px"
            alt="work"
        />

        <VSkeletonLoader v-if="loading" type="text" />

        <VTextField
            v-else
            :model-value="token"
            readonly
            variant="outlined"
            density="comfortable"
            persistent-hint
            :hint="t('Add it to the Authorization header: Api-Token (your_token)')"
        >
          <template v-slot:append-inner>
            <VBtn
                :icon="copied ? 'mdi-check' : 'mdi-content-copy'"
                :color="copied ? 'success' : undefined"
                variant="text"
                size="small"
                @click="CopyToken"
            />
          </template>
        </VTextField>
      </VCardText>


      <VCardActions class="pa-3 d-flex gap-3 justify-center">
        <VBtn
            variant="tonal"
            to="/"
        >
          {{ t('Back') }}
        </VBtn>

        <VBtn
            variant="tonal"
            color="info"
            to="/api/conversion/documentation"
        >
          {{ t('Documentation') }}

          <VIcon
              size="20"
              class="ms-2"
          >
            mdi-information-outline
          </VIcon>
        </VBtn>

        <VSpacer />

        <VBtn
            variant="flat"
            color="primary"
            @click="RegenerateToken"
        >
          {{ t('Refresh Token') }}

          <VIcon
              size="20"
              class="ms-2"
          >
            mdi-key-plus
          </VIcon>
        </VBtn>
      </VCardActions>
    </VCard>
  </div>
</template>

<style scoped>

</style>