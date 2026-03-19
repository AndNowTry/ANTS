<script setup>
import { ref } from "vue"

const ConversionOptions = {
  png:  ["jpg", "jpeg", "webp", "pdf"],
  jpg:  ["png", "jpeg", "webp", "pdf"],
  jpeg: ["png", "jpg",  "webp", "pdf"],
  webp: ["png", "jpg",  "jpeg", "pdf"],
  pdf:  [],
  doc:  ["pdf"],
  docx: ["pdf"],
  xls:  ["pdf"],
  xlsx: ["pdf"],
  ppt:  ["pdf"],
  pptx: ["pdf"],
  mp4:  ["mp4"],
  mov:  ["mp4"],
  avi: ["mp4"],
  mkv:  ["mp4"],
  flv:  ["mp4"],
  wmv: ["mp4"],
  mp3:  ["mp3"],
  wav:  ["mp3"],
  aac: ["mp3"],
  flac: ["mp3"],
  ogg:  ["mp3"],
  m4a: ["mp3"],
}

function GetOptions(file)
{
  const ext = file?.name.split(".").pop().toLowerCase()
  return ConversionOptions[ext] ?? []
}

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  },
  maxQuantity: {
    type: Number,
    default: 1
  }
})
const emit = defineEmits(['update:modelValue'])


const inputRef = ref(null)


function UpdateFileType(index, value)
{
  const updated = [...props.modelValue]
  updated[index] = { ...updated[index], file_type_need: value }
  emit('update:modelValue', updated)
}

function ActivateInput()
{
  inputRef.value.click()
}

function OnFileChange(e)
{
  const file = e.target.files[0]
  if (!file) return

  emit('update:modelValue', [...props.modelValue, { file, file_type_need: null }])

  e.target.value = null  // чтобы можно было добавить тот же файл
}

function RemoveItem(index)
{
  const updated = [...props.modelValue]
  updated.splice(index, 1)
  emit('update:modelValue', updated)
}

function FormatSize(bytes)
{
  if (bytes < 1024) return bytes + " B"
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " kB"
  return (bytes / (1024 * 1024)).toFixed(1) + " MB"
}

function GetIcon(file)
{
  if (!file) return "mdi-file"

  const ext = file.name.split(".").pop().toLowerCase()

  if (["png","jpg","jpeg","webp"].includes(ext)) return "mdi-image"
  if (["mp4","mov","avi","mkv"].includes(ext)) return "mdi-video"
  if (["mp3","wav","aac","flac"].includes(ext)) return "mdi-music"
  if (["pdf","doc","docx","xls","xlsx","ppt","pptx"].includes(ext)) return "mdi-file-document"
  return "mdi-file"
}
</script>

<template>
  <div>
    <template v-for="(item, index) in modelValue" :key="index">
      <div
          v-if="item && item.file"
          class="d-flex align-center gap-3 px-3 py-2"
          style="border-bottom: 0.5px solid rgba(0,0,0,0.1)"
      >
        <VAvatar color="secondary">
          <VIcon :icon="GetIcon(item.file)" />
        </VAvatar>

        <div style="flex: 1; min-width: 0">
          <div class="text-body-2 text-truncate">
            {{ item.file.name }}
          </div>

          <div class="text-caption text-medium-emphasis">
            {{ FormatSize(item.file.size) }}
          </div>
        </div>

        <VSelect
            :model-value="item.file_type_need"
            @update:modelValue="UpdateFileType(index, $event)"
            label="Convert to"
            variant="outlined"
            density="compact"
            hide-details
            max-width="140"
            :items="GetOptions(item.file)"
            :disabled="!item.file"
        />

        <VBtn
            icon="mdi-close"
            size="36"
            @click="RemoveItem(index)"
        />
      </div>
    </template>

    <div class="d-flex justify-center align-center py-3">
      <VBtn
          :disabled="modelValue.length === maxQuantity"
          @click="ActivateInput"
      >
        <VIcon
            icon="mdi-paperclip"
            class="mr-2"
        />

        Browse Files
      </VBtn>
    </div>

    <input
        ref="inputRef"
        type="file"
        style="display: none"
        @change="OnFileChange"
    />
  </div>
</template>