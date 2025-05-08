<script setup>
import BaseCardComponent from './BaseCardComponent.vue';

defineProps({
  nombre: {
    type: String,
    required: true
  },
  imagen: {
    type: String,
    default: ''
  },
  descripcion: {
    type: String,
    required: true
  },
  tecnologias: {
    type: Array,
    required: true,
    default: () => []
  }
});
</script>

<template>
  <BaseCardComponent>
    <div class="p-4">
      <div class="mb-4">
        <img :src="imagen" :alt="nombre" class="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-4 border-[#be985d]">
      </div>
      <h5 class="text-xl font-bold text-gray-900 mb-3 text-center">{{ nombre }}</h5>
      <p class="text-gray-600 mb-4 text-center">{{ descripcion }}</p>
      <div class="flex justify-center space-x-4">
      </div>
    </div>
  </BaseCardComponent>
</template>