<script setup>
import IdeologyThermometer from './thermometers/IdeologyThermometerComponent.vue';

defineProps({
  grupo: Object
});
</script>

<template>
  <div class="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-start overflow-auto z-50 p-6">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-3xl relative">
     
      <button
        @click="$emit('close')"
        class="absolute top-2 right-2 text-gray-600 hover:text-black text-xl font-bold"
      >
        ×
      </button>

     
      <h2 class="text-2xl font-bold p-4 border-b text-black">
        {{ grupo.titular_general }}
      </h2>

     
      <div v-if="grupo.media_coeficiente !== null" class="px-4 pb-2 text-gray-800">
        <p class="text-sm font-semibold mb-1">Media del sesgo ideológico:</p>
        <IdeologyThermometer
          :coeficiente="grupo.media_coeficiente"
          :showValue="true"
          height="h-2"
          class="max-w-full"
        />
      </div>

    
      <img
        v-if="grupo.imagen"
        :src="grupo.imagen"
        alt="Imagen representativa del grupo"
        class="w-full h-64 object-cover rounded-b-md"
      />

      
      <div class="p-4 space-y-4">
        <div
          v-for="noticia in grupo.noticias"
          :key="noticia.id"
          class="border rounded-md p-3 bg-gray-50 shadow-sm"
        >
          <p class="font-semibold text-black">{{ noticia.titulo }}</p>
          <p class="text-sm text-gray-600">Periódico: {{ noticia.periodico }}</p>
          <p
            v-if="noticia.justificacion"
            class="text-xs text-gray-500 mt-1 italic"
          >
            Justificación: {{ noticia.justificacion }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
