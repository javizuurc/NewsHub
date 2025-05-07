<script setup>
import BaseCard from './BaseCardComponent.vue';

defineProps({
  titulo: {
    type: String,
    required: true
  },
  valor: {
    type: [String, Number],
    required: true
  },
  descripcion: {
    type: String,
    default: ''
  },
  colorBorde: {
    type: String,
    default: 'blue'
  },
  colorTexto: {
    type: String,
    default: 'blue'
  },
  hayDatos: {
    type: Boolean,
    default: true
  }
});
</script>

<template>
  <BaseCard :customClass="`border-t-4 border-${colorBorde}-500 bg-white`">
    <div class="p-5">
      <h2 class="text-xl font-semibold text-gray-800 mb-2">{{ titulo }}</h2>
      <div v-if="hayDatos">
        <p class="text-4xl font-bold mb-3" :class="`text-${colorTexto}-600`">
          {{ valor }}
        </p>
        <p class="text-sm text-gray-500">{{ descripcion }}</p>
      </div>
      <div v-else class="text-gray-400 italic">
        No hay datos disponibles
      </div>
    </div>
  </BaseCard>
</template>