<script setup>
import NavMenu from './components/NavMenuComponent.vue';
import FooterComponent from './components/FooterComponent.vue';
</script>

<template>
  <div class="flex flex-col h-screen">
    <NavMenu class="flex-shrink-0"></NavMenu>
    <router-view />
    <FooterComponent class="flex-shrink-0"></FooterComponent>
  </div>
</template>

<style scoped>
@media (max-width: 768px) {
  main {
    height: auto;
    min-height: 0;
  }
}
</style>