<script setup>
  import { ref } from 'vue';
  import axios from 'axios';
  import IdeologyThermometer from '../thermometers/IdeologyThermometerComponent.vue';

  const props = defineProps({
    show: Boolean,
    title: {
      type: String,
      default: 'Formulario'
    }
  });

  const emits = defineEmits(['close', 'submit']);

  const newsUrl = ref('');
  const score = ref(null);

  const close = () => {
    emits('close');
  };

  const submitForm = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/ai/evaluar-noticia`,
    {
      url: newsUrl.value
    }
  );


      score.value = Number(response.data.score);
      console.log('Puntuación:', score.value);

    } catch (error) {
      console.error('Error al evaluar la noticia:', error);
      score.value = 'Error al obtener la puntuación';
    }
  };
</script>

<template>
  <div v-if="show" class="fixed inset-0 flex items-center justify-center bg-white/30 backdrop-blur-sm z-50">
    <div class="bg-gray-100 p-6 rounded-lg shadow-lg w-1/2 max-w-md relative">
      <h2 class="text-2xl font-semibold mb-4 text-black">{{ title }}</h2>
      
      <form @submit.prevent="submitForm">
        <div class="mb-4">
          <label class="block text-gray-700">URL de la Noticia:</label>
          <input 
            type="url" 
            v-model="newsUrl" 
            class="border p-2 w-full text-black" 
            placeholder="Ingrese la URL"
            required 
          />
        </div>

        <div v-if="score != null" class="mb-4">
          <p class="text-gray-800">Puntuación del sesgo ideológico:</p>
          <IdeologyThermometer 
            v-if="score != null && !isNaN(score)" 
            :coeficiente="score" 
            class="my-1.5 max-w-full"
            height="h-1.5"
            :showValue="true"
          />
        </div>

        <div class="flex flex-col sm:flex-row justify-center sm:justify-end gap-2">
          <button 
            type="button" 
            @click="close" 
            class="bg-gray-500 text-white py-2 px-4 mr-2 rounded"
          >
            Cancelar
          </button>

          <button 
            type="submit" 
            class="bg-blue-500 text-white py-2 px-4 rounded"
            @click="'127.0.0.1:3000/evaluar-noticia'"
          >
            Enviar
          </button>
        </div>
      </form>
    </div>
  </div>
</template>