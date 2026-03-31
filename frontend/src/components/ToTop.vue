<script setup>
import { useWindowScroll } from '@vueuse/core'

function onClick()
{
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  })
}
const { y } = useWindowScroll()
</script>

<template>
  <div class="pointer-events-initial">
    <VFabTransition>
      <VBtn
          v-show="y > 200"
          color="primary"
          elevation="8"
          size="60"
          icon
          @click="onClick"
      >
        <VIcon>
          mdi-chevron-up
        </VIcon>
      </VBtn>
    </VFabTransition>
  </div>
</template>

<style scoped>
.pointer-events-initial
{
  position: fixed;
  z-index: 99999;
  inset-block-end: 3rem;
  inset-inline-end: 10rem;
}
</style>
