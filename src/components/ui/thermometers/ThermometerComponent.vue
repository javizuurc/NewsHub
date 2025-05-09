<script setup>
import { computed } from 'vue';

const props = defineProps({
  value: {
    type: Number,
    required: true,
    validator: (val) => val >= 0 && val <= 100
  },
  title: {
    type: String,
    default: 'Tendencia'
  },
  width: {
    type: Number,
    default: 600
  },
  showValue: {
    type: Boolean,
    default: true
  }
});

const fillWidth = computed(() => {
  return `${props.value}%`;
});

const fillColor = computed(() => {
  if (props.value < 35) return 'bg-gradient-to-r from-red-600 to-red-400';
  if (props.value < 65) return 'bg-gradient-to-r from-yellow-600 to-yellow-400';
  return 'bg-gradient-to-r from-blue-500 to-blue-400';
});

const positionLabel = computed(() => {
  if (props.value < 35) return 'Izquierda';
  if (props.value < 65) return 'Centro';
  return 'Derecha';
});

const textColor = computed(() => {
  if (props.value < 35) return 'text-sky-500';
  if (props.value < 65) return 'text-amber-500';
  return 'text-rose-500';
});
</script>

<template>
  <div class="flex flex-col items-center p-4 bg-[#2C2C2C]/90 rounded-lg shadow-lg shadow-black/20 my-4 absolute bottom-[30px] left-1/2 -translate-x-1/2 z-40 backdrop-blur-sm border-2 border-[#be985d] w-auto">
    <h5 class="text-lg font-semibold text-[#be985d] mb-3 font-cormorant">{{ title }}</h5>
    
    <div class="flex flex-col items-center justify-center w-full">
      <div class="relative h-10 bg-gray-100 rounded-full overflow-hidden my-4" :style="{ width: `${width}px` }">
        <div class="relative w-full h-full bg-transparent overflow-hidden rounded-full">
          <div class="absolute left-0 h-full transition-all duration-1000 ease-in-out shadow-[0_0_15px_rgba(255,255,255,0.4)]" :class="fillColor" :style="{ width: fillWidth }"></div>
        </div>
        <div class="absolute w-full -bottom-[30px] flex justify-between px-[5%]">
          <span class="text-[#be985d] font-semibold text-sm self-start">Izquierda</span>
          <span class="text-[#be985d] font-semibold text-sm self-center">Centro</span>
          <span class="text-[#be985d] font-semibold text-sm self-end">Derecha</span>
        </div>
      </div>
      
      <div v-if="showValue" class="mt-2 flex flex-col items-center">
        <span class="text-2xl font-bold" :class="textColor">{{ positionLabel }}</span>
      </div>
    </div>
  </div>
</template>