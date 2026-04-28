<script setup>
import { ConversionOptions, FormatSize, GetFileType } from "@/utils/files.js"
import { GetIcon } from "@/utils/icons.js"
import { computed } from "vue"
import { useI18n } from 'vue-i18n'
import { DownloadFile } from "@/utils/download.js"
const { t } = useI18n()


const props = defineProps({
  modelValue: Array,
  ready: Boolean,
  maxSize: Number,
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


function OnFilesSelected(selected)
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

  files.value = newFiles.slice(0, props.maxSize ?? 6)
}


function UpdateFileType(type, index)
{
  files.value[index].need_type = type

  for(const file of files.value)
  {
    if(!file?.need_type)
    {
      return
    }
  }

  emit('update:ready', true)
}


function RemoveFile(index)
{
  const updated = [...files.value]
  updated.splice(index, 1)
  files.value = updated

  if(files.value.length !== 0)
  {
    for(const file of files.value)
    {
      if(!file?.need_type)
      {
        console.log(file)

        emit('update:ready', false)

        return
      }
    }
  }
  else
  {
    emit('update:ready', false)
  }
}

function GetLoadingForFile(file)
{
  return props.loading?.[file.name] ?? null
}

function GetDownloadForFile(file)
{
  return props.download?.[file.name] ?? null
}
</script>

<template>
  <VFileUpload
      :model-value="files"
      multiple
      density="compact"
      variant="compact"
      :filter-by-type="Object.keys(ConversionOptions).map(ext => `.${ext}`).join(',')"
      @update:modelValue="OnFilesSelected"
  >
    <template #default>
      <VFileUploadDropzone
          v-if="files.length < (maxSize ?? 6) && !loading && !download"
          density="compact"
          :filter-by-type="Object.keys(ConversionOptions).map(ext => `.${ext}`).join(',')"
          :title="t('Drag or select a files')"
      />

      <VFileUploadList
          :disabled="false"
          class="mb-0 mt-0 pt-0"
      >
        <template #default="{ files: vFiles, onClickRemove }">
          <VList class="mt-2" lines="two">
            <VListItem
                v-for="(file, index) in vFiles"
                :key="file.id"
                class="mb-2 border rounded-lg"
                :prepend-icon="GetIcon(GetFileType(file))"
            >
              <template #title>
                <span class="text-body-2 text-truncate">{{ file.name }}</span>
              </template>

              <template #subtitle>
                <span class="text-caption">{{ FormatSize(file.size) }}</span>
              </template>

              <template #append>
                <div class="d-flex align-center gap-2">
                  <VSelect
                      label="Need type"
                      @update:modelValue="type => UpdateFileType(type, index)"
                      :items="ConversionOptions[GetFileType(file)] || []"
                      :disabled="!!GetLoadingForFile(file) || !!GetDownloadForFile(file)"
                      density="compact"
                      variant="outlined"
                      hide-details
                      width="140"
                  />

                  <VProgressCircular
                      v-if="
                        GetLoadingForFile(file)
                        && GetLoadingForFile(file)?.status !== 'error'
                      "
                      :model-value="GetLoadingForFile(file).num_status"
                      :size="36"
                      :width="3"
                      color="primary"
                  >
                    <span style="font-size: 8px">
                      {{ GetLoadingForFile(file).num_status }}%
                    </span>
                  </VProgressCircular>

                  <VBtn
                      v-if="
                        GetLoadingForFile(file)
                        && GetLoadingForFile(file)?.status === 'error'
                      "
                      icon
                      size="small"
                      variant="tonal"
                      color="error"
                  >
                    <VIcon size="18">
                      mdi-alert-circle-outline
                    </VIcon>

                    <VTooltip
                        activator="parent"
                        location="bottom"
                    >
                      {{ t('Error') }}
                    </VTooltip>
                  </VBtn>

                  <VBtn
                      v-if="GetDownloadForFile(file)"
                      icon
                      size="small"
                      variant="tonal"
                      color="success"
                      @click="DownloadFile(GetDownloadForFile(file).url)"
                  >
                    <VIcon size="18">
                      mdi-download
                    </VIcon>

                    <VTooltip
                        activator="parent"
                        location="bottom"
                    >
                      {{ t('Download') }}
                    </VTooltip>
                  </VBtn>

                  <VBtn
                      icon
                      size="small"
                      variant="tonal"
                      color="error"
                      :disabled="!!GetLoadingForFile(file) || !!GetDownloadForFile(file)"
                      @click="RemoveFile(index)"
                  >
                    <VIcon size="18">
                      mdi-close
                    </VIcon>
                  </VBtn>
                </div>
              </template>
            </VListItem>
          </VList>
        </template>
      </VFileUploadList>
    </template>
  </VFileUpload>
</template>