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
      default: "/images/default-news.jpg",
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
    customClass="bg-white border border-[#C0C0C0] w-full h-full hover:shadow-md transition-all duration-300"
  >
    <article class="flex flex-col h-full">
      <div class="min-h-[70px] bg-[#F1F1F1] overflow-hidden rounded-t-lg">
        <img 
          :src="imageUrl" 
          :alt="title" 
          class="w-full h-20 lg:h-40 object-cover transition-transform duration-300 hover:scale-105"
        >
      </div>
      <div class="flex-1 flex flex-col p-2">
        <h4 class="text-xs lg:text-base font-bold mb-0.5 text-[#2C2C2C] truncate leading-tight">{{ title }}</h4>
        <div class="flex-1">
          <p v-for="(text, index) in content" 
            :key="index" 
            class="text-xs lg:text-sm text-[#2C2C2C] truncate mb-0.5 leading-tight">
            {{ text }}
          </p>
        </div>
        <div v-if="badge" class="mt-0.5">
          <span class="inline-block bg-[#F1F1F1] text-[#be985d] px-2 py-0.5 rounded-full text-[0.65rem] font-semibold shadow shadow-black/10 tracking-wide">
            {{ badge }}
          </span>
        </div>
      </div>
      <div class="border-t mt-2" style="border-color: #C0C0C0"></div>
    </article>
  </BaseCard>
</template>

<style scoped>
</style>