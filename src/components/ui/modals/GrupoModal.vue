<script setup>
import IdeologyThermometer from '../thermometers/IdeologyThermometerComponent.vue';
import { computed } from 'vue';

defineProps({
  grupo: Object
});
defineEmits(['close']);

const parseJustificacion = (justificacion) => {
  try {
    const parsed = JSON.parse(justificacion);
    return Array.isArray(parsed) ? parsed : [justificacion];
  } catch {
    return [justificacion];
  }
};

const getTendenciaIdeologica = (coef) => {
  if (coef == null) return null;
  if (coef <= -5.00 && coef >= -6.00) return 'Ultra-Izquierda';
  if (coef < -2.00 && coef > -5.00) return 'Izquierda';
  if (coef < -1.00 && coef >= -1.99) return 'Leve Izquierda';
  if (coef <= 0.99 && coef >= -0.99) return 'Centro';
  if (coef >= 1.00 && coef <= 1.99) return 'Leve Derecha';
  if (coef > 1.99 && coef <= 4.99) return 'Derecha';
  if (coef >= 5.00 && coef <= 6.00) return 'Ultra-Derecha';
  return 'Fuera de rango';
};

const formatPeriodico = (nombre) => {
  if (!nombre) return '';
  return nombre
    .replace(/_/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};
</script>

<template>
  <div
    class="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-start overflow-auto z-50 p-6"
    @click="$emit('close')"
  >
    <div
      class="bg-white rounded-lg shadow-xl w-full max-w-3xl relative"
      @click.stop
    >
      <button
        @click="$emit('close')"
        class="absolute top-2 right-2 text-gray-600 hover:text-black text-xl font-bold"
      >
        ×
      </button>

      <h2 class="text-2xl font-bold p-4 border-b text-black font-cormorant">
        {{ grupo.titular_general }}
      </h2>

      <img
        v-if="grupo.imagen"
        :src="grupo.imagen"
        alt="Imagen representativa del grupo"
        class="w-full h-64 object-cover rounded-b-md"
      />

      <div v-if="grupo.media_coeficiente != null" class="px-4 pb-2 text-gray-800 pt-3">
        <p class="text-sm font-semibold mb-1">
          Media del sesgo ideológico:
          <span class="ml-2 text-black">
            {{ grupo.media_coeficiente != null ? grupo.media_coeficiente.toFixed(2) : '' }}
            ({{ getTendenciaIdeologica(grupo.media_coeficiente) }})
          </span>
        </p>
        <IdeologyThermometer
          :coeficiente="grupo.media_coeficiente"
          :showValue="false"
          height="h-2"
          class="max-w-full"
        />
      </div>

      <div class="p-4 space-y-4">
        <a
          v-for="noticia in grupo.noticias"
          :key="noticia.id"
          :href="noticia.url"
          target="_blank"
          rel="noopener noreferrer"
          class="block border rounded-md p-3 bg-gray-50 shadow-sm hover:bg-gray-100 transition"
        >
          <p class="font-semibold text-black font-cormorant">{{ noticia.titulo }}</p>
          <p class="text-sm text-gray-600 tracking-wide">
            Periódico: {{ formatPeriodico(noticia.periodico) }}
          </p>

          <div
            v-if="noticia.justificacion"
            class="text-sm text-gray-700 leading-relaxed mt-2"
          >
            <p class="italic font-semibold text-black mb-1 font-cormorant">Justificación:</p>

            <p
              v-for="(item, idx) in parseJustificacion(noticia.justificacion)"
              :key="idx"
              class="mb-1 before:content-['\2014'] before:mr-2"
            >
              {{ item }}
            </p>
          </div>

          <div v-if="noticia.coeficiente !== null" class="text-xs text-right mt-2 italic text-gray-700">
            Tendencia: {{ getTendenciaIdeologica(noticia.coeficiente) }}
          </div>
        </a>
      </div>
    </div>
  </div>
</template>