<script setup>
import {computed, onMounted, ref} from "vue"
import { authStore } from "@/stores/auth.js"
import axios from "@/axios/axios.js"


const auth = authStore()


const advertising = ref([])
const isClosed = ref(false)
const isLoaded = ref(false)


const isSidebarOpen = computed(() =>
    (auth.access === 'guest' || auth.access === 'user') &&
    !isClosed.value &&
    !auth.isProfileSidebarOpen &&
    advertising.value.length > 0
)


async function LoadAds()
{
  if(isLoaded.value) return

  try
  {
    const response = await axios.get("ads/")

    if(response.data.status === "success")
    {
      advertising.value = response.data.data
      isLoaded.value = true
    }
  }
  catch(error)
  {
    console.error(error)
  }
}


onMounted(() => {
  if (auth.access === 'guest' || auth.access === 'user') LoadAds()
})
</script>


<template>
  <VNavigationDrawer
      v-model="isSidebarOpen"
      location="end"
      temporary
      width="400"
      elevation="2"
      touchless
      :scrim="false"
      class="app-customizer"
      expand-on-hover
      app
  >
    <VCard flat>
      <template #append>
        <VBtn
            icon
            variant="tonal"
            size="38"
            @click="isClosed = true"
        >
          <VIcon
              size="22"
              icon="mdi-close"
          />
        </VBtn>
      </template>

      <VCardText class="d-flex flex-column gap-4 align-center overflow-scroll">
        <template
            v-for="ad in advertising"
            :key="ad.id"
        >
          <VTooltip location="start bottom">
            <template #activator="{ props }">
              <a
                  v-bind="props"
                  :href="ad.link"
                  target="_blank"
              >
                <img
                    :src="ad.image"
                    :alt="ad.title"
                    style="width: 100%; border-radius: 8px;"
                />
              </a>
            </template>

            <span>{{ ad.title }}</span>
          </VTooltip>
        </template>
      </VCardText>
    </VCard>
  </VNavigationDrawer>
</template>


