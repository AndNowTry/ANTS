<script setup>
import { computed, ref } from "vue"
import { authStore } from "@/stores/auth.js"
import { ReadError } from "@/utils/error_reader.js"
import { useI18n } from 'vue-i18n'
import { toastStore } from "@/stores/toastes.js"
import { historyStore } from "@/stores/history.js"


const toastes = toastStore()
const history = historyStore()
const auth = authStore()
const { t } = useI18n()


function formatDay(dateStr)
{
  const d = new Date(dateStr)
  const month = (d.getMonth() + 1).toString().padStart(2, '0')
  const day = d.getDate().toString().padStart(2, '0')
  return `${d.getFullYear()}-${month}-${day}`
}

const filesCountByDay = computed(() => {
  const map = {}
  history.records.forEach(file => {
    const key = formatDay(file.created_at)
    map[key] = (map[key] || 0) + 1
  })
  return Object.entries(map).map(([day, value], index) => ({
    key: index + 1,
    title: day,
    value
  }))
})

const filesSizeByDay = computed(() => {
  const map = {}
  history.records.forEach(file => {
    const key = formatDay(file.created_at)
    map[key] = (map[key] || 0) + file.new_file_size / (1024 * 1024)
  })
  return Object.entries(map).map(([day, value], index) => ({
    key: index + 1,
    title: day,
    value: Math.round(value * 100) / 100
  }))
})

const filesSizeByAllDays = computed(() => {
  let size = 0
  history.records.forEach(file => {
    size += file.new_file_size / (1024 * 1024)
  })
  return size.toFixed(2)
})



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

    toastes.AddToast('success', t('Avatar successfully updated'), 'mdi-check')
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

    toastes.AddToast('success', t('Username successfully updated'), 'mdi-check')
  }
  catch(error)
  {
    newUserNameFormError.value = ReadError(error)

    toastes.AddToast('error', error.message, 'mdi-alert-circle-outline')
  }
}


const UserLevel = computed({
  get()
  {
    const info = auth.info
    if (!info) return null

    const subscription = info.subscriptions?.find(s => s.plan === info.level && s.is_active)

    const items = [{ title: 'user', value: 'user' }, ...(info.subscriptions ?.filter(s => s.is_active && s.plan !== 'user').map(s => ({ title: s.plan, value: s.plan })) ?? [])]

    const hint = subscription?.expires_at ? t('Subscription until:') + ' ' + new Date(subscription.expires_at).toLocaleString() : undefined

    return {
      current:    info.level,
      started_at: subscription?.started_at ?? null,
      expires_at: subscription?.expires_at ?? null,
      items,
      hint,
    }
  },
  async set(value)
  {
    try
    {
      await auth.UpdateUserProfile({ level: value })

      toastes.AddToast('success', t('Level successfully updated'), 'mdi-check')
    }
    catch (error)
    {
      console.error(error)

      toastes.AddToast('error', error.message, 'mdi-alert-circle-outline')
    }
  }
})
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
        {{ t('Profile') }}
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
              icon="mdi-close"
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

        <VSelect
            :disabled="!auth.info?.subscriptions?.length"
            class="w-100 mb-10"
            :model-value="UserLevel?.current"
            @update:modelValue="UserLevel = $event"
            :label="t('Level')"
            variant="outlined"
            density="comfortable"
            persistent-hint
            :hint="UserLevel?.hint"
            :items="UserLevel?.items"
        />

        <VDivider
            style="width: 120px"
            content-offset="1rem"
            thickness="2"
        >
          <span class="text-title-medium">
            {{ t('Activity') }}

            <VTooltip
                interactive
                location="top"
            >
              <template v-slot:activator="{ props }">
                <VIcon
                    size="16"
                    style="margin-top: -14px"
                    v-bind="props"
                >
                  mdi-information-outline
                </VIcon>
              </template>

              <div>
                {{ t('Based on history') }}
              </div>
            </VTooltip>
          </span>
        </VDivider>

        <VPie
            :title="t('File count by day')"
            :size="240"
            :palette="['#048BA8', '#99C24D', '#F18F01', '#FF6F61', '#6A0572', '#AB83A1', '#FFD700']"
            tooltip
            class="pa-3 mt-3 justify-center"
            gap="2"
            inner-cut="70"
            rounded="2"
            animation
            hide-slice
            reveal
            :items="filesCountByDay"
        >
          <template v-slot:center>
            <div class="text-center">
              <div class="text-display-medium">{{ history.records.length }}</div>
              <div class="opacity-70 mt-1 mb-n1">{{ t('Total') }}</div>
            </div>
          </template>
        </VPie>

        <VPie
            :title="t('File size by day')"
            :size="240"
            :palette="['#6A0572', '#AB83A1', '#F18F01', '#FFD700', '#048BA8', '#99C24D']"
            tooltip
            class="pa-3 mt-3 justify-center"
            gap="2"
            inner-cut="70"
            rounded="2"
            animation
            hide-slice
            reveal
            :items="filesSizeByDay"
        >
          <template v-slot:center>
            <div class="text-center">
              <div class="text-display-medium">{{ filesSizeByAllDays }}</div>
              <div class="opacity-70 mt-1 mb-n1">{{ t('Total MB') }}</div>
            </div>
          </template>
        </VPie>
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
