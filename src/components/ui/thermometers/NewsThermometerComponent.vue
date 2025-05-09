<script setup>
  import { computed } from 'vue';
  import ThermometerComponent from './ThermometerComponent.vue';

  const props = defineProps({
    coeficiente: {
      type: Number,
      default: 0,
      required: true
    },
    showValue: {
      type: Boolean,
      default: true
    },
    height: {
      type: String,
      default: 'h-2'
    }
  });

  const thermometerValue = computed(() => {
    return ((props.coeficiente + 6) / 12) * 100;
  });

  const posicionTexto = computed(() => {
    const valor = props.coeficiente;
    switch (true) {
      case (valor <= -3.00 && valor >= -6.00):
        return 'Izquierda';
      case (valor >= -2.99 && valor <= -1.00):
        return 'Leve Izquierda';
      case (valor >= -0.99 && valor <= 0.99):
        return 'Centro';
      case (valor >= 1.00 && valor <= 2.99):
        return 'Leve Derecha';
      case (valor >= 3.00 && valor <= 6.00):
        return 'Derecha';
      default:
        return 'Fuera de rango';
    }
  });
</script>

<template>
  <div class="news-thermometer">
    <ThermometerComponent 
      v-if="false"
      :value="thermometerValue" 
      :showValue="showValue"
      :width="200"
      title="Tendencia Ideológica"
    />
    
    <div class="thermometer-container">
      <div class="flex rounded-full overflow-hidden" :class="height">
        <div class="bg-red-500 flex-1"></div>
        <div class="bg-gray-300 flex-[0.5]"></div>
        <div class="bg-blue-500 flex-1"></div>
      </div>
      <div class="relative w-full h-0">
        <div 
          class="absolute w-2 h-3 -mt-2.5 rounded-full bg-black transform -translate-x-1/2"
          :style="{ left: `${thermometerValue}%` }"
        ></div>
      </div>
      <div v-if="showValue" class="flex justify-between text-xs text-gray-600 dark:text-gray-400 mt-1 font-overpass">
        <span>{{ posicionTexto }}</span>
        <span>{{ coeficiente.toFixed(2) }}</span>
      </div>
    </div>
  </div>
</template>