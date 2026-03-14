<script setup>
import { authStore } from "@/stores/auth.js"

const auth = authStore()

const ConversationOptions = [
  {
    name: 'guest',
    label: 'Guest',
    icon: 'mdi-file-move-outline',
  },
  {
    name: 'user',
    label: 'User',
    icon: 'mdi-file-clock-outline',
    access: ['user', 'professional']
  },
  {
    name: 'professional',
    label: 'Professional',
    icon: 'mdi-file-multiple-outline',
    access: ['professional']
  },
  {
    name: 'api',
    label: 'Api',
    icon: 'mdi-file-cog-outline',
    access: ['api', 'professional']
  },
]
</script>


<template>
  <div class="d-flex justify-center align-center" style="height: 100%">
    <v-row class="pa-4" style="width: 100%; max-width: 1200px;">
      <v-col
          v-for="option in ConversationOptions"
          :key="option.name"
          cols="12"
          sm="3"
      >
        <v-card
            :disabled="option?.access && !option?.access.includes(auth.userInfo?.level)"
            class="payment-card"
            outlined
            style="height: 400px; display: flex; flex-direction: column; justify-content: center;"
        >
          <v-card-text class="d-flex flex-column align-center gap-4">
            <v-icon size="80">
              {{ option.icon }}
            </v-icon>

            <h2 class="mt-3">
              {{ option.label }}
            </h2>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>


<style scoped>
.payment-card
{
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;
}

.payment-card:hover
{
  transform: scale(1.05);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.payment-card:active
{
  transform: scale(1);
}
</style>