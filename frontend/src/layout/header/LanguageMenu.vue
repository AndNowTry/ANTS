<script setup>
import { useI18n } from 'vue-i18n'
import { languageStore } from "@/stores/language.js"


const language = languageStore()
const { t } = useI18n()
</script>

<template>
  <VMenu
      offset="16"
      location="bottom end"
  >
    <template v-slot:activator="{ props }">
      <VBtn
          icon
          v-bind="props"
      >
        <VBadge
            location="bottom right"
            color="primary"
            :content="t(language.current)"
        >
          <VIcon>
            mdi-web
          </VIcon>
        </VBadge>
      </VBtn>
    </template>

    <VList>
      <VListItem @click="language.UpdateLanguage('ru')">
        <VListItemTitle>{{ t('Russian') }}</VListItemTitle>
      </VListItem>

      <VListItem @click="language.UpdateLanguage('en')">
        <VListItemTitle>{{ t('English') }}</VListItemTitle>
      </VListItem>
    </VList>
  </VMenu>
</template>

<style scoped>
.v-list
{
  border-radius: 10px !important;
}
</style>