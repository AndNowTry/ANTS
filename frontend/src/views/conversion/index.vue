<script setup>
import { ref, computed } from "vue"
import { authStore } from "@/stores/auth.js"

import StepOne from "@/views/conversion/external_components/StepOne.vue"
import StepTwo from "@/views/conversion/external_components/StepTwo.vue"
import StepThree from "@/views/conversion/external_components/StepThree.vue"
import axios from "@/axios/axios.js"
import { historyStore } from "@/stores/history.js"


const auth = authStore()
const history = historyStore()

const access = computed(() => auth.userInfo?.level)
const AllQuantity = {
  'guest': 1,
  'user': 1,
  'professional': 6
}


const step = ref(1)
const items = ref([])



const canProceed = computed(() =>
    items.value.every(i => i.file && i.file_type_need)
)


const eventSources = []

function listenStatus(index, task_id) {
  const es = new EventSource(`http://localhost:8000/api/file_convert/status/${task_id}/`, { withCredentials: true })
  eventSources.push(es)

  es.onerror = () => {
    es.close()
    items.value[index].status = "error"
    items.value[index].error = "Connection lost"
  }

  es.onmessage = (event) => {
    const data = JSON.parse(event.data)
    Object.assign(items.value[index], data)

    if (data.status === "done" || data.status === "error")
    {
      es.close()
      return
    }
  }
}

async function uploadItem(index) {
  const item = items.value[index]
  const formData = new FormData()
  formData.append("file", item.file)
  formData.append("file_type_need", item.file_type_need)
  formData.append("file_type_come", item.file?.name.split(".").pop().toLowerCase())

  items.value[index].status = "uploading"

  const res  = await fetch("http://localhost:8000/api/file_convert/upload/", {
    method: "POST",
    body: formData,
    credentials: "include",
  })
  const { data } = await res.json()

  if (res.status === 429) {
    items.value[index].status = "error"
    items.value[index].error  = data.message
    return
  }

  items.value[index].task_id = data.task_id
  listenStatus(index, data.task_id)
}

async function startConversion()
{
  step.value = 2
  await Promise.all(items.value.map((_, i) => uploadItem(i)))
}

function reset() {
  eventSources.forEach(es => es.close())
  eventSources.length = 0
  items.value = []
  step.value = 1
}


async function UpdateHistory()
{
  try
  {
    await history.UpdateAllHistory()
  }
  catch(error)
  {
    console.error(error)
  }
}

</script>

<template>
  <div class="d-flex justify-center align-center" style="height: 100%">
    <VCard width="800">
      <VStepper
          v-model="step"
          :items="['File selection', 'Processing', 'Done']"
      >
        <template v-slot:item.1>
          <VCard flat>
            <VCardText>
              <StepOne v-model="items" :max-quantity="AllQuantity[access]" />
            </VCardText>
          </VCard>
        </template>

        <template v-slot:item.2>
          <VCard flat>
            <VCardText>
              <StepTwo :model-value="items" />
            </VCardText>
          </VCard>
        </template>

        <template v-slot:item.3>
          <VCard flat>
            <VCardText>
              <StepThree :model-value="items" />
            </VCardText>
          </VCard>
        </template>

        <template v-slot:actions="{ next, prev }">
          <VStepperActions>

            <template v-slot:prev="{ props }">
              <VBtn
                  v-if="step === 1"
                  v-bind="props"
                  disabled
              >
                Back
              </VBtn>
              <VBtn
                  v-else-if="step === 3"
                  variant="tonal"
                  @click="reset"
              >
                Convert more
              </VBtn>
              <VBtn
                  v-else
                  v-bind="props"
                  disabled
              >
                Back
              </VBtn>
            </template>

            <template v-slot:next="{ props }">
              <VBtn
                  v-if="step === 1"
                  color="primary"
                  :disabled="!canProceed"
                  @click="startConversion"
              >
                Convert
              </VBtn>
              <VBtn
                  v-else-if="step === 2"
                  color="primary"
                  :disabled="items.some(i => i.status !== 'done' && i.status !== 'error')"
                  @click="() => { step = 3; UpdateHistory()}"
              >
                Continue
              </VBtn>
              <VBtn
                  v-else
                  v-bind="props"
                  disabled
              >
                Next
              </VBtn>
            </template>

          </VStepperActions>
        </template>

      </VStepper>
    </VCard>
  </div>
</template>