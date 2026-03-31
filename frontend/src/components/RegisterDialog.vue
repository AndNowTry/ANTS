<script setup>
import { computed, ref } from "vue"
import { authStore } from "@/stores/auth.js"
import { ReadError } from "@/utils/error_reader.js"


const auth = authStore()
const dialog = computed(() => auth.openRegistrationDialogByUser)


const form = ref(false)
const alertMessage = ref('')
const formFields = ref({
  username: {
    value: null,
  },
  email: {
    value: null,
  },
  password1: {
    value: null,
    visible: false,
  },
  password2: {
    value: null,
    visible: false,
  },
})


async function Register()
{
  if(!form.value) return

  alertMessage.value = ""

  try
  {
    await auth.RegisterUser(
        formFields.value.username.value,
        formFields.value.email.value,
        formFields.value.password1.value,
        formFields.value.password2.value,
    )

    auth.OpenLoginForm()

    formFields.value = {
      username: {
        value: null,
      },
      email: {
        value: null,
      },
      password1: {
        value: null,
        visible: false,
      },
      password2: {
        value: null,
        visible: false,
      },
    }
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
      @click:outside="auth.CloseRegisterForm"
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
              v-model="formFields.username.value"
              label="Username"
              variant="outlined"
              density="comfortable"
              clearable
              :rules="[
                value => !!value || 'Username is required',
              ]"
          />

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
              v-model="formFields.password1.value"
              label="Password"
              :type="formFields.password1.visible ? 'text' : 'password'"
              variant="outlined"
              density="comfortable"
              clearable
              :rules="[
                value => !!value || 'Password is required',
              ]"
              :append-inner-icon="
                formFields.password1.visible ? 'mdi-eye' : 'mdi-eye-off'
              "
              @click:append-inner="
                formFields.password1.visible = !formFields.password1.visible
              "
          />

          <VTextField
              v-model="formFields.password2.value"
              label="Repeat password"
              :type="formFields.password2.visible ? 'text' : 'password'"
              variant="outlined"
              density="comfortable"
              clearable
              :rules="[
                value => !!value || 'Password is required',
              ]"
              :append-inner-icon="
                formFields.password2.visible ? 'mdi-eye' : 'mdi-eye-off'
              "
              @click:append-inner="
                formFields.password2.visible = !formFields.password2.visible
              "
          />

          <div class="d-flex align-center justify-space-between mt-5">
            <VBtn
                :disabled="!form"
                width="200"
                color="success"
                class="mb-5"
                @click="Register"
            >
              Register
            </VBtn>
          </div>
        </VForm>

        <div
            class="text-center mb-4"
            @click="auth.OpenLoginForm"
        >
          Or login?
        </div>
      </VCardText>
    </VCard>
  </VDialog>
</template>

<style scoped>

</style>