<script setup>
import {ref, computed, watch} from "vue"
import { authStore } from "@/stores/auth.js"
import { historyStore } from "@/stores/history.js"
import { FormatSize } from "@/utils/files.js"
import { useI18n } from 'vue-i18n'
import FileItem from "@/views/UIConversion/components/FileItem.vue"
import FileItemsList from "@/views/UIConversion/components/FileItemsList.vue"
import api from "@/axios/axios.js"
import router from "@/router/index.js"


const { t } = useI18n()
const auth = authStore()
const history = historyStore()


const FILE_SIZE_LIMITS = {
  guest: 100 * 1024 * 1024,
  user: 250 * 1024 * 1024,
  professional: 500 * 1024 * 1024,
}

const UserCapabilities = {
  guest: 1,
  user: 1,
  api: 1,
  professional: 6,
}

const maxFiles = computed(() => UserCapabilities[auth.access] ?? 1)
const fileSizeLimit = computed(() => FILE_SIZE_LIMITS[auth.access] ?? FILE_SIZE_LIMITS.guest)
const isSingle = computed(() => maxFiles.value === 1)

const files = ref([])
const loading = ref(null)
const download = ref(null)

const canConverted = ref(false)

const eventSources = []

function listenStatus(filename, task_id)
{
  const es = new EventSource(
      `http://localhost:8000/api/file_convert/status/${task_id}/`,
      { withCredentials: true }
  )
  eventSources.push(es)

  es.onmessage = (event) => {
    const data = JSON.parse(event.data)

    loading.value = {
      ...loading.value,
      [filename]: {
        status:     data.status,
        num_status: data.progress ?? 0,
      }
    }

    if (data.status === 'done')
    {
      const updated = { ...loading.value }
      delete updated[filename]
      loading.value = Object.keys(updated).length ? updated : null

      download.value = {
        ...download.value,
        [filename]: { url: data.file_url }
      }

      UpdateHistory()

      es.close()
    }
    else if (data.status === 'error')
    {
      es.close()
    }
  }

  es.onerror = () => {
    es.close()
    loading.value = {
      ...loading.value,
      [filename]: { status: 'Connection lost', num_status: 0 }
    }
  }
}

async function uploadFile(file)
{
  try
  {
    await api.post("/auth/refresh/")
  }
  catch
  {
    return
  }

  const formData = new FormData()
  formData.append("file", file)
  formData.append("file_type_need", file.need_type)
  formData.append("file_type_come", file.name.split(".").pop().toLowerCase())

  loading.value = {
    ...loading.value,
    [file.name]: { status: 'uploading', num_status: 0 }
  }

  const res = await fetch("http://localhost:8000/api/file_convert/upload/", {
    method: "POST",
    body: formData,
    credentials: "include",
  })
  const { data } = await res.json()

  if (res.status === 429)
  {
    loading.value = {
      ...loading.value,
      [file.name]: { status: data.message, num_status: 0 }
    }
    return
  }

  listenStatus(file.name, data.task_id)
}

async function Convert()
{
  loading.value  = {}
  download.value = null
  await Promise.all(files.value.map(f => uploadFile(f)))
}

function Reset()
{
  eventSources.forEach(es => es.close())
  eventSources.length = 0
  files.value = []
  loading.value = null
  download.value = null
}

async function UpdateHistory()
{
  try
  {
    await history.UpdateAllHistory()
  }
  catch
  {
    try
    {
      await history.UpdateAllHistory()
    }
    catch (e)
    {
      console.error(e)
    }
  }
}

async function GoToPayment()
{
  await router.push('/user-plans')
}
</script>

<template>
  <div
      class="d-flex justify-center align-center"
      style="height: 100%"
  >
    <VCard width="800">
      <VCardTitle class="pt-4 d-flex gap-4">
        <VChip
            v-if="auth.access === 'professional'"
            label
            color="warning"
        >
          {{ t('Maximum files') + ': ' + maxFiles }}
        </VChip>
        <VBadge
            v-else
            color="primary"
            content="+"
            class="cursor-pointer"
            @click="GoToPayment"
        >
          <VChip
              label
              color="warning"
          >
            {{ t('Maximum files') + ': ' + maxFiles }}
          </VChip>
        </VBadge>


        <VChip
            v-if="auth.access === 'professional'"
            label
            color="warning"
        >
          {{ t('Max file size') + ': ' + FormatSize(fileSizeLimit) }}
        </VChip>
        <VBadge
            v-else
            color="primary"
            content="+"
            class="cursor-pointer"
            @click="GoToPayment"
        >
          <VChip
              label
              color="warning"
          >
            {{ t('Max file size') + ': ' + FormatSize(fileSizeLimit) }}
          </VChip>
        </VBadge>
      </VCardTitle>

      <VCardText class="pt-4">
        <template v-if="isSingle">
          <FileItem
              v-model="files"
              v-model:ready="canConverted"
              :loading="loading ? Object.values(loading)[0] ?? null : null"
              :download="download ? Object.values(download)[0] ?? null : null"
              :file-size-limit="fileSizeLimit"
          />
        </template>

        <template v-else>
          <FileItemsList
              v-model="files"
              v-model:ready="canConverted"
              :max-size="maxFiles"
              :loading="loading"
              :download="download"
              :file-size-limit="fileSizeLimit"
          />
        </template>
      </VCardText>

      <VCardActions class="pt-0 pb-0">
        <VBtn variant="tonal" to="/">
          {{ t('Close') }}
        </VBtn>

        <VSpacer />

        <VBtn
            v-if="download"
            variant="tonal"
            color="secondary"
            @click="Reset"
        >
          {{ t('Reset') }}
        </VBtn>

        <VBtn
            :disabled="files.length <= 0 || !canConverted || !!loading || !!download"
            variant="flat"
            color="primary"
            @click="Convert"
        >
          <VIcon class="mr-2">mdi-autorenew</VIcon>
          {{ t('Convert') }}
        </VBtn>
      </VCardActions>
    </VCard>
  </div>
</template>