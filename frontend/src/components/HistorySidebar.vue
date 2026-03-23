<script setup>
import { historyStore } from "@/stores/history.js";
import { computed } from "vue"
import axios from "@/axios/axios.js"

const history = historyStore()

const historyItems = computed(() => {
  return history.history
})

function GetIcon(file)
{
  if (!file) return "mdi-file"

  const ext = file.split(".").pop().toLowerCase()
  if (["png","jpg","jpeg","webp"].includes(ext)) return "mdi-image"
  if (["mp4","mov","avi","mkv"].includes(ext)) return "mdi-video"
  if (["mp3","wav","aac","flac"].includes(ext)) return "mdi-music"
  if (["pdf","doc","docx","xls","xlsx","ppt","pptx"].includes(ext)) return "mdi-file-document"

  return "mdi-file"
}

async function DeleteFileFromHistory(id)
{
  try
  {
    const DeleteFileHistoryResponse = await axios.post("/file_convert/history/", {
      id: id
    })

    if(DeleteFileHistoryResponse.data.status === "success")
    {
      history.UpdateAllHistory(DeleteFileHistoryResponse.data.data.data)
    }
  }
  catch(error)
  {
    console.error(error)
  }
}

async function DownloadFileFromHistory(url)
{
  const res = await fetch('http://localhost:8000' + url)
  const blob = await res.blob()
  const blobUrl = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = blobUrl
  a.download = decodeURIComponent(url.split('/').pop().split('______name______').slice(1).join('_'))
  a.click()
  URL.revokeObjectURL(blobUrl)
}
</script>

<template>
  <VNavigationDrawer
      temporary
      width="360"
      elevation="2"
      touchless
      class="app-customizer"
      expand-on-hover
      permanent
      rail
  >
    <v-list density="compact" nav>
      <v-list-item>
        <template v-slot:prepend>
          <v-badge location="top right" color="error" content="1">
            <v-icon icon="mdi-history"></v-icon>
          </v-badge>
        </template>
      </v-list-item>

      <v-list-item
          v-for="item in historyItems"
          :key="item"
          :value="item.id"

          :prepend-icon="GetIcon(item.original_filename)"
          :title="item.original_filename"
          :subtitle="item.original_file_type + ' → ' + item.new_file_type"
      >
        <template v-slot:append>
          <VBtn
              color="success"
              icon="mdi-download"
              variant="text"
              @click="DownloadFileFromHistory(item.new_file_path)"
          ></VBtn>

          <VBtn
              color="error"
              icon="mdi-trash-can-outline"
              variant="text"
              @click="DeleteFileFromHistory(item.id)"
          ></VBtn>
        </template>
      </v-list-item>
    </v-list>
  </VNavigationDrawer>
</template>

