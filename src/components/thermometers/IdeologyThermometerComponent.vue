<script setup>
  import { computed } from 'vue';

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

  const indicatorPosition = computed(() => {
    const percentage = ((props.coeficiente + 6) / 12) * 100;
    return Math.min(Math.max(percentage, 0), 100);
  });

  // Determinar el texto de la posición ideológica
  const posicionTexto = computed(() => {
    if (props.coeficiente <= -3) return 'Izquierda';
    if (props.coeficiente < -1) return 'Leve Izquierda';
    if (props.coeficiente < 1) return 'Centro';
    if (props.coeficiente < 3) return 'Leve Derecha';
    return 'Derecha';

    // JAVI: Usar el switch mejor que esos if
    /*
    switch (props.coeficiente) {
      case props.coeficiente <= -3:
        return 'Izquierda'
        break;
      case props.coeficiente < -1:
        return 'Leve Izquierda'
        break;

      case props.coeficiente <= 1:
        return 'Centro'
        break;
      
      case props.coeficiente < 3:
        return 'Leve Derecha'
        break;
      case props.coeficiente > 3:
        return 'Derecha'
        break;
      default:
        break;
    }
    */
  });
</script>

<template>
  <div class="thermometer-container">
    <div class="flex rounded-full overflow-hidden" :class="height">
      <div class="bg-red-500 flex-1"></div>
      <div class="bg-gray-300 flex-[0.5]"></div>
      <div class="bg-blue-500 flex-1"></div>
    </div>
    <div class="relative w-full h-0">
      <div 
        class="absolute w-2 h-3 -mt-2.5 rounded-full bg-black transform -translate-x-1/2"
        :style="{ left: `${indicatorPosition}%` }"
      ></div>
    </div>
    <div v-if="showValue" class="flex justify-between text-xs text-gray-600 dark:text-gray-400 mt-1">
      <span>{{ posicionTexto }}</span>
      <span>{{ coeficiente.toFixed(2) }}</span>
    </div>
  </div>
</template>