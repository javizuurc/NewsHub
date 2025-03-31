<script setup>
  const props = defineProps({
      sectionTitle: {
          type: String,
          required: true
      }
  })
</script>

<template>
  <aside class="w-full md:w-full flex-shrink-0 bg-[#F1F1F1] text-[#2C2C2C] md:flex md:flex-col h-full">
    <div class="p-4 flex flex-col h-full">
      <h4 class="text-xl font-bold mb-4 border-b-2 border-[#b08d57] pb-2 text-[#be985d] text-center">{{ sectionTitle }}</h4>
      <div class="flex-1 overflow-y-auto">
        <slot></slot>
      </div>
    </div>
  </aside>
</template>