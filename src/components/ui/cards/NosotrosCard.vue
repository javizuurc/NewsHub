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
    <div class="p-6">
      <h3 class="text-2xl font-bold text-gray-900 mb-3">{{ nombre }}</h3>
      <div class="mb-4">
        <img :src="imagen" :alt="nombre" class="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-4 border-amber-600">
      </div>
      <p class="text-gray-600 mb-4">{{ descripcion }}</p>
      <div class="flex justify-center space-x-4">
      </div>
    </div>
  </BaseCardComponent>
</template>