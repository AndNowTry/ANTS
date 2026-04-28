<script setup>
import { ref } from "vue"
import { authStore } from "@/stores/auth.js"
import { ReadError } from "@/utils/error_reader.js"
import { historyStore } from "@/stores/history.js"
import { useI18n } from "vue-i18n"
const { t } = useI18n()


const auth = authStore()
const history = historyStore()


const form = ref(false)
const formFields = ref({
  alert: '',
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

  formFields.value.alert = ''

  try
  {
    await auth.LoginUser(
        formFields.value.email.value,
        formFields.value.password.value,
        formFields.value.keepUserLoggen.value,
    )
    await auth.GetUserProfile()
    await history.UpdateAllHistory()

    formFields.value = {
      alert: '',
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
    formFields.value.alert = ReadError(error)
  }
}
</script>

<template>
  <VDialog
      v-model="auth.login"
      width="500"
      persistent
      no-click-animation
      @click:outside="auth.CloseLoginForm"
  >
    <VCard>
      <VCardText class="d-flex flex-column gap-5">
        <div class="d-flex justify-center">
          <img src="../../icons/Logo.png" style="width: 150px" />
        </div>

        <VAlert
            v-if="formFields.alert"
            :text="formFields.alert"
            color="error"
            variant="outlined"
        />

        <VForm
            v-model="form"
            class="d-flex flex-column gap-3"
        >
          <VTextField
              v-model="formFields.email.value"
              :label="t('Email')"
              type="email"
              variant="outlined"
              density="comfortable"
              clearable
              :rules="[
                value => !!value || t('Email is required'),
                value => /.+@.+\..+/.test(value) || t('Email must be valid'),
              ]"
          />

          <VTextField
              v-model="formFields.password.value"
              :label="t('Password')"
              :type="formFields.password.visible ? 'text' : 'password'"
              variant="outlined"
              density="comfortable"
              clearable
              :rules="[
                value => !!value || t('Password is required'),
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
                :label="t('Keep me logged in')"
            />

            <VBtn
                :disabled="!form"
                width="200"
                color="success"
                class="mb-5"
                @click="Login"
            >
              {{ t('Login') }}
            </VBtn>
          </div>
        </VForm>

        <a
            href="#"
            class="text-center text-decoration-none mb-4 link-style d-block"
            @click.prevent="auth.OpenRegisterForm"
        >
          {{ t('Or create a new account?') }}
        </a>
      </VCardText>
    </VCard>
  </VDialog>
</template>

<style scoped>

</style>