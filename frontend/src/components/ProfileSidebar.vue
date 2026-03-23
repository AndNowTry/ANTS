<script setup>
import { computed, ref } from "vue"
import { authStore } from "@/stores/auth.js"
import { UpdateProfile } from "@/utils/update_profile.js"
import { ReadError } from "@/utils/error_reader.js"


const auth = authStore()


const availableForUser = computed(() => {
  return auth.userInfo?.email !== undefined ? true : false
})
const isSidebarOpen = ref(false)

const userInfo = computed(() => {
  return auth.userInfo
})
const fileInputRef = ref(null)



function OpenFilePicker()
{
  fileInputRef.value.click()
}

function OnFileChange(event)
{
  const file = event.target.files[0]
  if (!file) return

  try
  {
    UpdateProfile({ avatar: file })
  }
  catch(error)
  {
    console.error(error)
  }
}



const newUserName = ref('')
const openNewUserNameForm = ref(false)
const newUserNameFormError = ref('')

function UpdateUsername(username)
{
  newUserNameFormError.value = ''
  try
  {
    UpdateProfile({ username: username })
  }
  catch(error)
  {
    newUserNameFormError.value = ReadError(error)
  }
}
</script>

<template>
  <VBtn
      v-if="availableForUser"
      icon
      class="customizer-toggler rounded d-print-none me-n2"
      elevation="8"
      size="small"
      @click="isSidebarOpen = !isSidebarOpen"
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
      v-if="availableForUser"
      v-model="isSidebarOpen"
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
            @click="isSidebarOpen = !isSidebarOpen"
        >
          <VIcon
              size="22"
              icon="mdi-close-box-multiple-outline"
          />
        </VBtn>
      </template>

      <VCardText class="d-flex flex-column align-center gap-2">
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
            <VImg :src="'http://localhost:8000/' + userInfo.avatar" cover />

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
            v-model="userInfo.username"
            :readonly="true"
            label="Username"
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
                class="w-100"
                v-model="newUserName"
                label="New username"
                variant="outlined"
                density="comfortable"
                clearable
                :rules="[
                    value => !!value || 'New username is required',
                ]"
                :error-messages="newUserNameFormError"
                @input="newUserNameFormError = ''"
            />
          </div>
        </VExpandTransition>

        <VTextField
            class="w-100"
            :disabled="true"
            :model-value="userInfo.email"
            label="Email"
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
