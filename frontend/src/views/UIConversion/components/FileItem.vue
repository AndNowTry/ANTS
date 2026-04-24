<script setup>
import { useI18n } from 'vue-i18n'
import { GetIcon } from "@/utils/icons.js"
import { computed } from "vue"
import { ConversionOptions, FormatSize, GetFileType } from "@/utils/files.js"
import { DownloadFile } from "@/utils/download.js"
const { t } = useI18n()


const props = defineProps({
  modelValue: Array,
  ready: Boolean,
  loading: Object,
  download: Object,
  fileSizeLimit: {
    type: Number,
    default: 100 * 1024 * 1024
  }
})

const emit = defineEmits([
  'update:modelValue',
  'update:ready'
])

const files = computed({
  get: () => props.modelValue || [],
  set: value => emit('update:modelValue', value)
})


function OnFileSelected(selected)
{
  if (!selected) return

  const newFiles = Array.isArray(selected) ? selected : [selected]

  for(const file of newFiles)
  {
    if(file.size > props.fileSizeLimit)
    {
      return
    }
  }

  files.value = newFiles
}

function UpdateFileType(type)
{
  files.value[0].need_type = type
  emit('update:ready', true)
}

function DeleteFile()
{
  files.value = []
  emit('update:ready', false)
}
</script>


<template>
  <template v-if="!files.length">
    <div
        style="height: 250px;"
        class="d-flex justify-center align-center"
    >
      <VFileUpload
          :model-value="files"
          clearable
          class="mt-4"
          density="comfortable"
          variant="comfortable"
          :title="t('Drag or select a file')"
          @update:modelValue="OnFileSelected"
      />
    </div>
  </template>

  <template v-else>
    <VEmptyState
        :icon="GetIcon(GetFileType(files[0]))"
        :title="files[0].name"
        :disabled="props.loading != null || props.download != null"
        class="border rounded-lg"
    >
      <div class="d-flex align-center gap-5">
        <VTextField
            label="Type"
            :model-value="GetFileType(files[0])"
            :readonly="true"
            :disabled="props.loading != null || props.download != null"
            variant="outlined"
            density="compact"
            hide-details
            width="140"
        />

        <VIcon size="30">
          mdi-swap-horizontal
        </VIcon>

        <VSelect
            @update:modelValue="UpdateFileType"
            label="Need type"
            :disabled="props.loading != null || props.download != null"
            variant="outlined"
            density="compact"
            hide-details
            width="140"
            :items="ConversionOptions[GetFileType(files[0])]"
        />
      </div>

      <div
          v-if="props.download"
          class="d-flex justify-center mt-5"
      >
        <VBtn
            color="primary"
            @click="DownloadFile(download.url)"
        >
          Download
        </VBtn>
      </div>

      <div
          v-if="props.loading != null"
          class="position-absolute left-0 ms-10 mt-2"
      >
        <span>
          {{ props.loading.status }}
        </span>

        <VProgressLinear
            :buffer-value="props.loading.num_status"
            color="primary"
            rounded
            stream
            style="width: 720px"
        />
      </div>

      <div
          class="position-absolute top-0 left-0 ma-7"
          style="margin-top: 80px"
      >
        <VChip color="primary">
          {{ FormatSize(files[0].size) }}
        </VChip>
      </div>

      <div
          class="position-absolute top-0 right-0 ma-7"
          style="margin-top: 80px"
      >
        <VBtn
            icon
            color="error"
            size="40"
            :disabled="props.loading != null || props.download != null"
            @click="DeleteFile"
        >
          <VIcon>
            mdi-close
          </VIcon>

          <VTooltip
              activator="parent"
              location="bottom"
          >
            {{ t('Delete file') }}
          </VTooltip>
        </VBtn>
      </div>
    </VEmptyState>
  </template>
</template>
