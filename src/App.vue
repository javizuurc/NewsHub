<script setup>
import NavMenu from './components/NavMenuComponent.vue';
import NewsAside from './components/asides/NewsAside.vue';
import TopicsAside from './components/asides/TopicsAside.vue';
import SectionComponent from './components/SectionComponent.vue';
import FooterComponent from './components/FooterComponent.vue';
</script>

<template>
  <div class="flex flex-col h-screen">
    <NavMenu class="flex-shrink-0"></NavMenu>
    <main class="flex flex-col md:flex-row flex-grow overflow-y-auto md:overflow-hidden">
      <NewsAside class="w-full md:w-1/4 lg:w-1/5 flex-shrink-0 md:h-full md:overflow-y-auto"></NewsAside>
      <SectionComponent class="w-full flex-1 md:h-full"></SectionComponent>
      <TopicsAside class="w-full md:w-1/4 lg:w-1/5 flex-shrink-0 md:h-full md:overflow-y-auto"></TopicsAside>
    </main>
    <FooterComponent class="flex-shrink-0"></FooterComponent>
  </div>
</template>

<style scoped>
@media (max-width: 768px) {
  /* Permitir scroll vertical en móviles */
  main {
    height: auto;
    min-height: 0;
  }
}
</style>
