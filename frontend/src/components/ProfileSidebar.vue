<script setup>
import { ref } from "vue";

const isCustomizer = ref(false)

const avatarSrc = ref(null)
const fileInput = ref(null)

const username = ref('')

const openFilePicker = () => fileInput.value.click()

const onFileChange = (e) => {
  const file = e.target.files[0]
  if (!file) return
  avatarSrc.value = URL.createObjectURL(file)
}

const resetAvatar = () => {
  avatarSrc.value = null
  fileInput.value.value = ''
}


</script>

<template>
  <VBtn
      icon
      class="customizer-toggler rounded d-print-none me-n2"
      elevation="8"
      size="small"
      @click="isCustomizer = !isCustomizer"
  >
    <VIcon
        size="24"
        icon="mdi-account-edit"
    />
      <VTooltip
          activator="parent"
          location="top"
      >
        Profile
      </VTooltip>
  </VBtn>

  <VNavigationDrawer
      v-model="isCustomizer"
      location="end"
      temporary
      width="400"
      elevation="2"
      touchless
      class="app-customizer"
  >
    <VCard flat>
      <template #append>
        <VBtn
            icon
            variant="tonal"
            size="38"
            @click="isCustomizer = !isCustomizer"
        >
          <VIcon
              size="22"
              icon="mdi-close-box-multiple-outline"
          />
        </VBtn>
      </template>

      <VCardText class="d-flex flex-column align-center gap-5">
        <input
            ref="fileInput"
            type="file"
            accept="image/*"
            style="display: none"
            @change="onFileChange"
        />

        <VHover v-slot="{ isHovering, props }">
          <VAvatar
              size="96"
              color="surface-variant"
              style="cursor: pointer;"
              v-bind="props"
              @click="openFilePicker"
          >
            <VImg v-if="avatarSrc" :src="avatarSrc" cover />

            <VIcon v-else icon="mdi-account" size="48" />

            <VOverlay
                :model-value="!!isHovering"
                contained
                scrim="black"
                :opacity="0.5"
                class="d-flex align-center justify-center"
            >
              <VIcon icon="mdi-camera" color="white" size="28" />
            </VOverlay>
          </VAvatar>
        </VHover>

        <span
            v-if="avatarSrc"
            class="text-caption text-error"
            style="cursor: pointer;"
            @click="resetAvatar"
        >
          Remove photo
        </span>

        <span
            v-else
            class="text-caption text-medium-emphasis"
            style="cursor: pointer;"
            @click="openFilePicker"
        >
          Upload photo
        </span>

        <VTextField
            class="w-100"
            v-model="username"
            label="Username"
            variant="outlined"
            density="comfortable"
            clearable
            :rules="[
                value => !!value || 'Username is required',
             ]"
        />
      </VCardText>
    </VCard>
  </VNavigationDrawer>
</template>

<style>
.customizer-toggler
{
  position: fixed !important;
  z-index: 901;
  inset-block-end: 50%;
  inset-inline-end: 0;
}
</style>
