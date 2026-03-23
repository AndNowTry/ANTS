<script setup>
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
  <div
      class="d-flex align-center gap-3 px-3 py-2"
      style="border-bottom: 0.5px solid rgba(0,0,0,0.1)"
  >
    <VAvatar color="secondary">
      <VIcon :icon="GetIcon(item.file)" />
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

<style scoped>

</style>