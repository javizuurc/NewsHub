<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import AsideComponent from './AsideComponent.vue';
import TopicCard from '../ui/tags/TopicTagComponent.vue';

const diarios = ref({
  topicos: [],
  cargando: true,
  error: null,
  intervalId: null
});
const semanales = ref({
  topicos: [],
  cargando: true,
  error: null,
  intervalId: null
});

const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

const fetchTopicosDiarios = () => {
  diarios.value.cargando = true;
  fetch(import.meta.env.VITE_API_URL + '/api/noticias/topicos-diarios')
    .then(response => {
      if (!response.ok) throw new Error(`¡Error HTTP! Estado: ${response.status}`);
      return response.json();
    })
    .then(responseData => {
      diarios.value.cargando = false;
      diarios.value.topicos = (responseData && responseData.data)
        ? responseData.data.map(item => ({
          nombre: capitalize(item.palabra),
          url: `/topico/${item.palabra.toLowerCase()}`,
          frecuencia: item.frecuencia
        }))
        : [];
      diarios.value.error = null;
    })
    .catch(error => {
      console.error('Error al obtener los tópicos diarios:', error);
      diarios.value.cargando = false;
      diarios.value.error = error.message;
    });
};

const fetchTopicosSemanales = () => {
  semanales.value.cargando = true;
  fetch(import.meta.env.VITE_API_URL + '/api/noticias/topicos-semanales')
    .then(response => {
      if (!response.ok) throw new Error(`¡Error HTTP! Estado: ${response.status}`);
      return response.json();
    })
    .then(responseData => {
      semanales.value.cargando = false;
      semanales.value.topicos = (responseData && responseData.data)
        ? responseData.data.map(item => ({
          nombre: capitalize(item.palabra),
          url: `/topico/${item.palabra.toLowerCase()}`,
          frecuencia: item.frecuencia
        }))
        : [];
      semanales.value.error = null;
    })
    .catch(error => {
      console.error('Error al obtener los tópicos semanales:', error);
      semanales.value.cargando = false;
      semanales.value.error = error.message;
    });
};

onMounted(() => {
  fetchTopicosDiarios();
  fetchTopicosSemanales();

  diarios.value.intervalId = setInterval(fetchTopicosDiarios, 300000);
  semanales.value.intervalId = setInterval(fetchTopicosSemanales, 300000);
});

onBeforeUnmount(() => {
  if (diarios.value.intervalId) clearInterval(diarios.value.intervalId);
  if (semanales.value.intervalId) clearInterval(semanales.value.intervalId);
});
</script>

<template>
  <AsideComponent 
    sectionTitle="Tópicos" 
    class="bg-[#2C2C2C] rounded-lg shadow-md shadow-black/10"
    titleClass="text-[#be985d] border-[#b08d57] text-xl tracking-wide"
  >
    <ul class="space-y-6">
      <li>
        <h3 class="text-[#2C2C2C] font-medium mb-2">Tópicos Diarios</h3>
        <div v-if="diarios && diarios.value && diarios.value.cargando" class="p-2 text-center text-gray-300">
          Cargando tópicos diarios...
        </div>
        <div v-else-if="diarios && diarios.value && diarios.value.error" class="p-2 text-center text-red-500">
          Error: {{ diarios.value.error }}
        </div>
        <div v-else class="flex flex-wrap gap-1">
          <TopicCard 
            v-for="(topico, index) in (diarios && diarios.value ? diarios.value.topicos : [])" 
            :key="index" 
            :name="topico.nombre"
            :type="'daily'"
          />
        </div>
      </li>
      
      <li>
        <h3 class="text-[#2C2C2C] font-medium mb-2">Tópicos Semanales</h3>
        <div v-if="semanales && semanales.value && semanales.value.cargando" class="p-2 text-center text-gray-300">
          <p>Cargando tópicos semanales...</p>
        </div>
        <div v-else-if="semanales && semanales.value && semanales.value.error" class="p-2 text-center text-red-500">
          <p>Error: {{ semanales.value.error }}</p>
        </div>
        <div v-else class="flex flex-wrap gap-1">
          <TopicCard 
            v-for="(topico, index) in (semanales && semanales.value ? semanales.value.topicos : [])" 
            :key="index" 
            :name="topico.nombre"
            :type="'weekly'"
          />
        </div>
      </li>
    </ul>
  </AsideComponent>
</template>