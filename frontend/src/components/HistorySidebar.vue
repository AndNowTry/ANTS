<script setup>
import { historyStore } from "@/stores/history.js"
import { ref } from "vue"
import { GetIcon } from "@/utils/icons.js"
import { DownloadFile } from "@/utils/download.js"
import { authStore } from "@/stores/auth.js"


const history = historyStore()
const auth = authStore()


const isHover = ref(false)


function onLeave()
{
  isHover.value = false
}

function OnEnter()
{
  isHover.value = true
  setTimeout(() => history.MarkAsViewedAll(), 1000)
}
</script>

<template>
  <VNavigationDrawer
      v-if="auth.access !== 'guest'"
      width="360"
      elevation="2"
      touchless
      class="app-customizer"
      expand-on-hover
      permanent
      rail
      @mouseenter="OnEnter"
      @mouseleave="onLeave"
      app
  >
    <VList
        density="compact"
        nav
        :class="{ 'no-scroll': !isHover }"
    >
      <VListItem>
        <template v-slot:prepend>
          <VBadge
              v-if="history.records.some(obj => obj.viewed === false)"
              location="top right"
              color="error"
              :content="history.records.filter(obj => !obj.viewed).length"
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
          v-for="item in history.records"
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
              dot
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
              @click="history.DeleteRecordFromHistory(item.id, true)"
          ></VBtn>
        </template>
      </VListItem>
    </VList>
  </VNavigationDrawer>
</template>

<style scoped>
.no-scroll
{
  overflow: hidden !important;
  height: 100vh !important;
}
</style>