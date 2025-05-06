<script setup>
defineProps({
  text: {
    type: String,
    required: true
  },
  bgColor: {
    type: String,
    default: 'bg-[#2C2C2C]'
  },
  textColor: {
    type: String,
    default: 'text-[#C0C0C0]'
  },
  link: {
    type: String,
    default: ''
  }
});
</script>

<template>
  <component 
    :is="link ? 'a' : 'span'"
    :href="link || undefined"
    class="inline-block px-3 py-1 rounded-full text-sm font-medium transition-all duration-300 ease-in-out"
    :class="[bgColor, textColor]"
  >
    {{ text }}
  </component>
</template>