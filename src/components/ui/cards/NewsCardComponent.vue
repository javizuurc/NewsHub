<script setup>
  import { ref } from 'vue';
  
  import BaseCard from './BaseCardComponent.vue';
  import Thermometer from '../thermometers/NewsThermometerComponent.vue';

  const props = defineProps({
    titulo: {
      type: String,
      required: true
    },
    fecha: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    },
    periodico: {
      type: String,
      required: true
    },
    coeficiente: {
      type: Number,
      default: undefined
    }
  });

  const isHovered = ref(false);
</script>

<template>
  <BaseCard customClass="bg-white dark:bg-gray-800 border-l-4 border-[#be985d] p-0 hover:shadow-lg mt-1">
    <a 
      :href="url" 
      target="_blank" 
      rel="noopener noreferrer"
      class="block p-3 w-full h-full overflow-hidden"
      @mouseenter="isHovered = true"
      @mouseleave="isHovered = false"
    >
      <div class="flex flex-col h-full w-full">
        <div class="mb-2 w-full">
          <h5 class="text-sm font-semibold line-clamp-2 break-words font-cormorant text-black dark:text-[#F1F1F1]">
            {{ titulo }}
          </h5>
        </div>
        
        <div class="flex-grow flex flex-col justify-between w-full">

          <Thermometer 
            v-if="coeficiente != undefined" 
            :coeficiente="coeficiente" 
            class="my-1.5 max-w-full"
            height="h-1.5"
            :showValue="true"
          />
          
          <div class="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mt-auto w-full">
            <div class="flex items-center truncate mr-2">
              <span class="font-medium mr-2 truncate">{{ periodico }}</span>
              <span class="text-gray-400 truncate">{{ fecha }}</span>
            </div>
            
            <div 
              class="w-5 h-5 flex-shrink-0 flex items-center justify-center rounded-full transition-all duration-300"
              :class="isHovered ? 'bg-[#be985d] text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </a>
  </BaseCard>
</template>

<style scoped>
@keyframes silverShine {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.animate-silverShine {
  animation: silverShine 6s linear infinite !important;
  text-shadow: 0 0 3px rgba(200, 200, 200, 0.5);
  background-size: 200% auto !important;
  -webkit-background-clip: text !important;
  background-clip: text !important;
  -webkit-text-fill-color: transparent !important;
  text-fill-color: transparent !important;
}

:deep(.dark) .animate-silverShine {
  text-shadow: 0 0 4px rgba(220, 220, 220, 0.7);
}
</style>