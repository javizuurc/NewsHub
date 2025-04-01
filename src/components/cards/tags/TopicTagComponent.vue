<script setup>
  defineProps({
    name: {
      type: String,
      required: true
    },
    link: {
      type: String,
      default: '#'
    },
    type: {
      type: String,
      default: 'daily',
      validator: (value) => ['daily', 'weekly', 'custom'].includes(value)
    }
  })
</script>

<template>
  <a 
    :href="link" 
    class="inline-block px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ease-in-out mb-2 shadow-sm shadow-black/10 bg-[#2C2C2C] text-[#C0C0C0] hover:-translate-y-2 hover:shadow-md hover:shadow-black/15 hover:bg-[#b08d57] hover:text-white"
    :class="{
      'border border-[#b08d57]': type == 'daily',
      'border border-[#d4af37]': type == 'weekly',
      'border border-[#be985d]': type == 'custom'
    }"
  >
    {{ name }}
  </a>
</template>