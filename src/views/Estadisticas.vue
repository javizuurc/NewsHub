<script setup>
import NewsAside from '../components/asides/NewsAside.vue';
</script>
<template>
    <main class="flex flex-col md:flex-row flex-grow overflow-y-auto md:overflow-hidden">
      <NewsAside class="w-full md:w-1/4 lg:w-1/5 flex-shrink-0 md:h-full md:overflow-y-auto"></NewsAside>
    </main>
</template>

<style>
@media (max-width: 768px) {
  main {
    height: auto;
    min-height: 0;
  }
}
</style>