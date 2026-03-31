<script setup>
import { onMounted, ref } from "vue"
import axios from "@/axios/axios.js"
import router from "@/router/index.js"

const token = ref(null)
const loading = ref(false)
const copied = ref(false)

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
  setTimeout(() => copied.value = false, 2000)
}

onMounted(() => {
  GetToken()
})
</script>


<template>
  <div class="d-flex justify-center align-center"
       style="height: 100%"
  >
    <VCard width="740">
      <VCardText>
        <p class="text-body-2 text-medium-emphasis mb-4">
          Use this token to authenticate API requests.
          Add it to the <code>Authorization</code> header:
          <code>Api-Token &lt;your_token&gt;</code>
        </p>

        <VSkeletonLoader v-if="loading" type="text" />

        <VTextField
            v-else
            :model-value="token"
            readonly
            variant="outlined"
            density="comfortable"
            hide-details
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


      <VCardActions class="d-flex gap-3 justify-center ">
        <VBtn
            icon
            size="70"
            color="primary"
            variant="elevated"
            @click="RegenerateToken"
        >
          <VIcon size="35">
            mdi-key-plus
          </VIcon>

          <VTooltip
              activator="parent"
              location="bottom"
          >
            Refresh token
          </VTooltip>
        </VBtn>

        <VBtn
            icon
            size="70"
            variant="elevated"
            @click="router.push('/api-conversion/documentation')"
        >
          <VIcon size="35">
            mdi-text-box-search
          </VIcon>

          <VTooltip
              activator="parent"
              location="bottom"
          >
            Documentation
          </VTooltip>
        </VBtn>
      </VCardActions>
    </VCard>
  </div>
</template>

<style scoped>

</style>