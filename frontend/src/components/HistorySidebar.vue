<script setup>
import { historyStore } from "@/stores/history.js"
import { computed } from "vue"
import { GetIcon } from "@/utils/icons.js"
import { DownloadFile } from "@/utils/download.js"


const history = historyStore()

const historyItems = computed(() => {
  return history.records
})

async function DeleteFileFromHistory(id)
{
  try
  {
    await history.DeleteRecordFromHistory(id)
  }
  catch(error)
  {
    console.error(error)
  }
}

function OnEnter()
{
  setTimeout(() => history.MarkAsViewedAll(), 1000)
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
      @mouseenter="OnEnter"
      app
  >
    <VList density="compact" nav>
      <VListItem>
        <template v-slot:prepend>
          <VBadge
              v-if="historyItems.some(obj => obj.viewed === false)"
              location="top right"
              color="error"
              :content="historyItems.filter(obj => !obj.viewed).length"
          >
            <VIcon icon="mdi-history" />
          </VBadge>

          <VIcon
              v-else
              icon="mdi-history"
          />
        </template>
      </VListItem>

      <VListItem
          v-for="item in historyItems"
          :key="item"
          :value="item.id"

          :title="item.original_filename"
          :subtitle="item.original_file_type + ' → ' + item.new_file_type"
      >
        <template v-slot:prepend>
          <VBadge
              v-if="!item.viewed"
              location="top right"
              color="error"
          >
            <VIcon :icon="GetIcon(item.original_filename)" />
          </VBadge>

          <VIcon
              v-else
              :icon="GetIcon(item.original_filename)"
          />
        </template>

        <template v-slot:append>
          <VBtn
              color="success"
              icon="mdi-download"
              variant="text"
              @click="DownloadFile(item.new_file_path)"
          ></VBtn>

          <VBtn
              color="error"
              icon="mdi-trash-can-outline"
              variant="text"
              @click="DeleteFileFromHistory(item.id)"
          ></VBtn>
        </template>
      </VListItem>
    </VList>
  </VNavigationDrawer>
</template>

