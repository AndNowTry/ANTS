<script setup>
import { computed, ref } from "vue"
import { authStore } from "@/stores/auth.js"
import { ReadError } from "@/utils/error_reader.js"
import { useTheme } from "vuetify/framework"
import { historyStore } from "@/stores/history.js"

const auth = authStore()
const dialog = computed(() => auth.openLoginDialogByUser)
const theme = useTheme()
const history = historyStore()

const form = ref(false)
const alertMessage = ref('')
const formFields = ref({
  username: {
    value: null,
  },
  email: {
    value: null,
  },
  password: {
    value: null,
    visible: false,
  },
  keepUserLoggen: {
    value: true,
  },
})



async function Login()
{
  if(!form.value) return

  alertMessage.value = ""

  try
  {
    await auth.LoginUser(formFields.value.email.value, formFields.value.password.value)

    await auth.GetUserProfile()

    theme.change(auth.userInfo.theme)

    await history.UpdateAllHistory()

    formFields.value = {
      username: {
        value: null,
      },
      email: {
        value: null,
      },
      password: {
        value: null,
        visible: false,
      },
      keepUserLoggen: {
        value: false,
      },
    }
    auth.CloseLoginForm()
  }
  catch(error)
  {
    alertMessage.value = ReadError(error)
  }
}
</script>

<template>
  <VDialog
      v-model="dialog"
      width="500"
      persistent
      no-click-animation
      @click:outside="auth.CloseLoginForm"
  >
    <VCard>
      <VCardText class="d-flex flex-column gap-5">
        <div class="d-flex justify-center">
          <img src="../icons/Logo.png" style="width: 150px" />
        </div>

        <VAlert
            v-if="alertMessage"
            :text="alertMessage"
            color="error"
            variant="outlined"
        />

        <VForm
            v-model="form"
            class="d-flex flex-column gap-3"
        >
          <VTextField
              v-model="formFields.email.value"
              label="Email"
              type="email"
              variant="outlined"
              density="comfortable"
              clearable
              :rules="[
                value => !!value || 'Email is required',
                value => /.+@.+\..+/.test(value) || 'Email must be valid',
              ]"
          />

          <VTextField
              v-model="formFields.password.value"
              label="Password"
              :type="formFields.password.visible ? 'text' : 'password'"
              variant="outlined"
              density="comfortable"
              clearable
              :rules="[
                value => !!value || 'Password is required',
              ]"
              :append-inner-icon="
                formFields.password.visible ? 'mdi-eye' : 'mdi-eye-off'
              "
              @click:append-inner="
                formFields.password.visible = !formFields.password.visible
              "
          />

          <div class="d-flex align-center justify-space-between mt-5">
            <VCheckbox
                v-model="formFields.keepUserLoggen.value"
                label="Keep me logged in"
            />

            <VBtn
                :disabled="!form"
                width="200"
                color="success"
                class="mb-5"
                @click="Login"
            >
              Login
            </VBtn>
          </div>
        </VForm>

        <div
            class="text-center mb-4"
            @click="auth.OpenRegisterForm"
        >
          Or create a new account?
        </div>
      </VCardText>
    </VCard>
  </VDialog>
</template>

<style scoped>

</style>