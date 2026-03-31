<script setup>
import { GetIcon } from "@/utils/icons.js"
import { DownloadFile } from "@/utils/download.js"


const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['download'])
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
          <VIcon :icon="GetIcon(item.file.name)" />
        </VAvatar>

        <div style="flex: 1; min-width: 0">
          <div class="text-body-2 text-truncate">{{ item.file.name }}</div>
          <div class="text-caption text-medium-emphasis">→ {{ item.file_type_need }}</div>
        </div>

        <VChip
            v-if="item.status === 'error'"
            color="error"
            prepend-icon="mdi-alert-circle"
        >
          Error
        </VChip>

        <VBtn
            v-else-if="item.status === 'done'"
            variant="tonal"
            color="success"
            prepend-icon="mdi-download"
            @click="DownloadFile(item.file_url)"
        >
          Download
        </VBtn>
      </div>
    </template>
  </div>
</template>