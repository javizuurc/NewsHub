<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import AsideComponent from './AsideComponent.vue';
import TopicCard from '../cards/tags/TopicTagComponent.vue';

const topicosDiarios = ref([]);
const topicosSemanales = ref([]);
const cargandoDiarios = ref(true);
const cargandoSemanales = ref(true);
const errorDiarios = ref(null);
const errorSemanales = ref(null);
let intervalIdDiarios = null;
let intervalIdSemanales = null;

// Función para capitalizar la primera letra
const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

const fetchTopicosDiarios = () => {
    cargandoDiarios.value = true;
    fetch(import.meta.env.VITE_API_URL + '/api/noticias/topicos-diarios')
    .then(response => {
        if (!response.ok) {
            throw new Error(`¡Error HTTP! Estado: ${response.status}`);
        }
        return response.json();
    })
    .then(responseData => {
        console.log('Tópicos diarios obtenidos:', responseData);
        cargandoDiarios.value = false;
        if (responseData && responseData.data) {
            // Transformar los datos para que coincidan con lo que espera el componente
            topicosDiarios.value = responseData.data.map(item => ({
                nombre: capitalize(item.palabra),
                url: `/topico/${item.palabra.toLowerCase()}`,
                frecuencia: item.frecuencia
            }));
        } else {
            throw new Error('Formato de respuesta inválido');
        }
    })
    .catch(error => {
        console.error('Error al obtener los tópicos diarios:', error);
        cargandoDiarios.value = false;
        errorDiarios.value = error.message;
    });
};

const fetchTopicosSemanales = () => {
    cargandoSemanales.value = true;
    fetch(import.meta.env.VITE_API_URL + '/api/noticias/topicos-semanales')
    .then(response => {
        if (!response.ok) {
            throw new Error(`¡Error HTTP! Estado: ${response.status}`);
        }
        return response.json();
    })
    .then(responseData => {
        console.log('Tópicos semanales obtenidos:', responseData);
        cargandoSemanales.value = false;
        if (responseData && responseData.data) {
            // Transformar los datos para que coincidan con lo que espera el componente
            topicosSemanales.value = responseData.data.map(item => ({
                nombre: capitalize(item.palabra),
                url: `/topico/${item.palabra.toLowerCase()}`,
                frecuencia: item.frecuencia
            }));
        } else {
            throw new Error('Formato de respuesta inválido');
        }
    })
    .catch(error => {
        console.error('Error al obtener los tópicos semanales:', error);
        cargandoSemanales.value = false;
        errorSemanales.value = error.message;
    });
};

onMounted(() => {
    // Obtener tópicos inmediatamente al montar
    fetchTopicosDiarios();
    fetchTopicosSemanales();
    
    // Configurar intervalos para actualizar cada 5 minutos (300000 ms)
    intervalIdDiarios = setInterval(fetchTopicosDiarios, 300000);
    intervalIdSemanales = setInterval(fetchTopicosSemanales, 300000);
});

// Limpiar los intervalos cuando el componente se desmonta
onBeforeUnmount(() => {
    if (intervalIdDiarios) {
        clearInterval(intervalIdDiarios);
    }
    if (intervalIdSemanales) {
        clearInterval(intervalIdSemanales);
    }
});
</script>

<template>
  <AsideComponent 
    sectionTitle="Tópicos" 
    class="bg-[#2C2C2C] rounded-lg shadow-md shadow-black/10"
    titleClass="text-[#be985d] border-[#b08d57] text-xl tracking-wide"
  >
    <ul class="space-y-6">
      <!-- Tópicos Diarios -->
      <li>
        <h3 class="text-[#b08d57] font-medium mb-2">Tópicos Diarios</h3>
        <div v-if="cargandoDiarios" class="p-2 text-center text-gray-300">
          Cargando tópicos diarios...
        </div>
        <div v-else-if="errorDiarios" class="p-2 text-center text-red-500">
          Error: {{ errorDiarios }}
        </div>
        <div v-else class="flex flex-wrap gap-1">
          <TopicCard 
            v-for="(topico, index) in topicosDiarios" 
            :key="index" 
            :name="topico.nombre"
            :link="topico.url"
            :type="'daily'"
          />
          <!-- Tópicos de ejemplo como fallback -->
          <TopicCard 
            v-if="topicosDiarios.length === 0"
            :key="'topico-diario-1'" 
            :name="'Economía'"
            :link="'/topico/economia'"
            :type="'daily'"
          />
        </div>
      </li>
      
      <!-- Tópicos Semanales -->
      <li>
        <h3 class="text-[#d4af37] font-medium mb-2">Tópicos Semanales</h3>
        <div v-if="cargandoSemanales" class="p-2 text-center text-gray-300">
          Cargando tópicos semanales...
        </div>
        <div v-else-if="errorSemanales" class="p-2 text-center text-red-500">
          Error: {{ errorSemanales }}
        </div>
        <div v-else class="flex flex-wrap gap-1">
          <TopicCard 
            v-for="(topico, index) in topicosSemanales" 
            :key="index" 
            :name="topico.nombre"
            :link="topico.url"
            :type="'weekly'"
          />
          <!-- Tópicos de ejemplo como fallback -->
          <TopicCard 
            v-if="topicosSemanales.length === 0"
            :key="'topico-semanal-1'" 
            :name="'Tecnología'"
            :link="'/topico/tecnologia'"
            :type="'weekly'"
          />
        </div>
      </li>
    </ul>
  </AsideComponent>
</template>