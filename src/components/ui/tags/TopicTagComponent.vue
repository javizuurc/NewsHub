<script setup>
import BaseTagComponent from './BaseTagComponent.vue';

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
});

const getBorderClass = (type) => {
  const classes = {
    'daily': 'border border-[#b08d57]',
    'weekly': 'border border-[#d4af37]',
    'custom': 'border border-[#be985d]'
  };
  return classes[type];
};
</script>

<template>
  <BaseTagComponent
    :text="name"
    :link="link"
    :class="[
      getBorderClass(type),
      'shadow-sm shadow-black/10 hover:-translate-y-2 hover:shadow-md hover:shadow-black/15 hover:bg-[#b08d57] hover:text-white mb-2',
      'bg-[#2C2C2C] text-[#C0C0C0] px-4 py-2 rounded-full font-medium transition-all duration-300 ease-in-out'
    ]"
  />
</template>