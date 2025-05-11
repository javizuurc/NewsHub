<script setup>
import NavMenu from './components/layout/NavMenuComponent.vue';
import FooterComponent from './components/layout/FooterComponent.vue';
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <NavMenu class="flex-shrink-0" />
    <div class="flex-grow">
      <router-view />
    </div>
    <FooterComponent class="flex-shrink-0" />
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