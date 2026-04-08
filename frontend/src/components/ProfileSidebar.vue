<script setup>
import { ref } from "vue"
import { authStore } from "@/stores/auth.js"
import { ReadError } from "@/utils/error_reader.js"
import { useI18n } from 'vue-i18n'
import { toastStore } from "@/stores/toastes.js"


const toastes = toastStore()
const auth = authStore()
const { t } = useI18n()



const fileInputRef = ref(null)



function OpenFilePicker()
{
  fileInputRef.value.click()
}

async function OnFileChange(event)
{
  const file = event.target.files[0]
  if (!file) return

  try
  {
    await auth.UpdateUserProfile({ avatar: file })

    toastes.AddToast('success', 'Avatar successfully updated.', 'mdi-check')
  }
  catch(error)
  {
    console.error(error)

    toastes.AddToast('error', error.message, 'mdi-alert-circle-outline')
  }
}



const newUserName = ref('')
const openNewUserNameForm = ref(false)
const newUserNameFormError = ref('')

async function UpdateUsername(username)
{
  newUserNameFormError.value = ''

  try
  {
    await auth.UpdateUserProfile({ username: username })

    toastes.AddToast('success', 'Username successfully updated.', 'mdi-check')
  }
  catch(error)
  {
    newUserNameFormError.value = ReadError(error)

    toastes.AddToast('error', error.message, 'mdi-alert-circle-outline')
  }
}
</script>

<template>
  <VBtn
      v-if="auth.info?.username"
      icon
      class="customizer-toggler rounded d-print-none me-n2"
      elevation="8"
      size="small"
      @click="auth.isProfileSidebarOpen = !auth.isProfileSidebarOpen"
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
      v-if="auth.info?.username"
      v-model="auth.isProfileSidebarOpen"
      location="end"
      temporary
      width="400"
      elevation="2"
      touchless
      class="app-customizer"
      app
      @close="auth.isProfileSidebarOpen = !auth.isProfileSidebarOpen"
  >
    <VCard flat>
      <template #append>
        <VBtn
            icon
            variant="tonal"
            size="38"
            @click="auth.isProfileSidebarOpen = !auth.isProfileSidebarOpen"
        >
          <VIcon
              size="22"
              icon="mdi-close-box-multiple-outline"
          />
        </VBtn>
      </template>

      <VCardText class="d-flex flex-column align-center">
        <input
            ref="fileInputRef"
            type="file"
            accept="image/*"
            style="display: none"
            @change="OnFileChange"
        />

        <VHover v-slot="{ isHovering, props }">
          <VAvatar
              size="96"
              color="surface-variant"
              style="cursor: pointer;"
              v-bind="props"
              @click="OpenFilePicker"
          >
            <VImg :src="auth.avatar" cover />

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

        <VTextField
            class="w-100 mt-8"
            v-model="auth.info.username"
            :readonly="true"
            :label="t('Username')"
            variant="outlined"
            density="comfortable"
            :append-inner-icon="openNewUserNameForm ? undefined : 'mdi-pencil-outline'"
            @click:append-inner="openNewUserNameForm = !openNewUserNameForm"
        />

        <VExpandTransition>
          <div
              class="w-100 d-flex flex-column gap-6"
              v-if="openNewUserNameForm"
          >
            <div
                class="d-flex align-center justify-center gap-4"
            >
              <VBtn
                  :disabled="!newUserName"
                  icon
                  @click="UpdateUsername(newUserName)"
              >
                <VIcon color="success">
                  mdi-pencil-outline
                </VIcon>
              </VBtn>

              <VIcon size="30">
                mdi-swap-vertical
              </VIcon>

              <VBtn
                  icon
                  @click="openNewUserNameForm = !openNewUserNameForm"
              >
                <VIcon color="error">
                  mdi-window-close
                </VIcon>
              </VBtn>
            </div>

            <VTextField
                class="w-100 mb-6"
                v-model="newUserName"
                :label="t('New username')"
                variant="outlined"
                density="comfortable"
                clearable
                :rules="[
                    value => !!value || t('New username is required'),
                ]"
                :error-messages="newUserNameFormError"
                @input="newUserNameFormError = ''"
            />
          </div>
        </VExpandTransition>

        <VTextField
            class="w-100"
            :disabled="true"
            :model-value="auth.info.email"
            :label="t('Email')"
            variant="outlined"
            density="comfortable"
        />

        <VTextField
            class="w-100"
            :disabled="true"
            :model-value="auth.info.level"
            :label="t('Level')"
            variant="outlined"
            density="comfortable"
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
