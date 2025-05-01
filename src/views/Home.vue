<script setup>
import NewsAside from '../components/asides/NewsAside.vue';
import TopicsAside from '../components/asides/TopicsAside.vue';
import SectionComponent from '../components/SectionComponent.vue';
</script>

<template>
  <div class="flex flex-col h-screen">
    <main class="flex flex-col md:flex-row flex-grow overflow-y-auto md:overflow-hidden">
      <NewsAside class="w-full md:w-1/4 lg:w-1/5 flex-shrink-0 md:h-full md:overflow-y-auto"></NewsAside>
      <SectionComponent class="w-full flex-1 md:h-full"></SectionComponent>
      <TopicsAside class="w-full md:w-1/4 lg:w-1/5 flex-shrink-0 md:h-full md:overflow-y-auto"></TopicsAside>
    </main>
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