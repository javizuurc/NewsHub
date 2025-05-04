<script setup>
  import BaseCard from './BaseCardComponent.vue';

  const props = defineProps({
    title: {
      type: String,
      required: true,
    },
    content: {
      type: Array,
      required: true,
    },
    badge: {
      type: String,
      default: "",
    },
    imageUrl: {
      type: String,
      default: "/images/default-news.jpg", // Imagen por defecto
    },
    isWide: {
      type: Boolean,
      default: false,
    },
    isTall: {
      type: Boolean,
      default: false,
    },
  });
</script>

<template>
  <BaseCard
    customClass="bg-white border border-yellow-400 w-full hover:shadow-xl transition-all duration-300 sm:h-auto"
  >
    <div class="flex flex-col h-full">
      <div class="min-h-[70px] sm:min-h-[100px] bg-gray-100 overflow-hidden rounded-t-lg">
        <img 
          :src="imageUrl" 
          :alt="title" 
          class="w-full h-16 sm:h-32 md:h-full object-cover transition-transform duration-300 hover:scale-105"
        >
      </div>
      <div class="flex-1 flex flex-col p-1.5 md:p-2">
        <h4 class="text-xs sm:text-sm md:text-base font-bold mb-0.5 text-gray-800 truncate leading-tight">{{ title }}</h4>
        <div class="flex-1">
          <p v-for="(text, index) in content" 
             :key="index" 
             class="text-xs md:text-sm text-gray-600 truncate mb-0.5 leading-tight">
             {{ text }}
          </p>
        </div>
        <div v-if="badge" class="mt-0.5">
          <span class="inline-block bg-gradient-to-r from-amber-600 to-yellow-400 text-gray-300 px-2 py-0.5 rounded-full text-[0.65rem] font-semibold shadow shadow-black/10 tracking-wide transform transition-all duration-200 ease-in-out hover:-translate-y-0.5 hover:shadow-md hover:from-yellow-400 hover:to-amber-600">
            {{ badge }}
          </span>
        </div>
      </div>
    </div>
  </BaseCard>
</template>

<style scoped>
</style>