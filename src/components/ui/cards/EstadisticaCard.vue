<script setup>
import { computed } from 'vue';
import BaseCard from './BaseCardComponent.vue';

const props = defineProps({
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
  },
  icon: {
    type: [Object, String], // Componente o SVG string
    default: null
  }
});

const hasIconSlot = computed(() => !!useSlots().icon);
</script>

<template>
  <BaseCard :customClass="`border-t-4 border-[#C0C0C0] bg-[#F1F1F1] shadow-md rounded-xl`">
    <div class="flex items-center gap-4 p-4">
      <div class="flex-shrink-0 w-10 h-10 rounded-full bg-[#C0C0C0] flex items-center justify-center">
        <template v-if="icon">
          <component v-if="typeof icon === 'object'" :is="icon" class="w-6 h-6 text-[#5A5A5A]" />
          <span v-else v-html="icon"></span>
        </template>
        <template v-else>
          <slot name="icon"></slot>
        </template>
      </div>
      <div class="flex-1">
        <h2 class="text-base font-semibold text-[#2C2C2C] mb-1 font-cormorant">{{ titulo }}</h2>
        <div v-if="hayDatos">
          <p class="text-2xl font-bold text-[#2C2C2C] mb-1">{{ valor }}</p>
          <p class="text-xs text-[#5A5A5A]">{{ descripcion }}</p>
        </div>
        <div v-else class="text-[#5A5A5A] italic text-xs">
          No hay datos disponibles
        </div>
      </div>
    </div>
  </BaseCard>
</template>