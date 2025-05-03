<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import AsideCard from '../cards/NewsCardComponent.vue';
import AsideComponent from './AsideComponent.vue';

const noticias = ref([]);
const cargando = ref(true);
const error = ref(null);
let intervalId = null;

console.log('API_URL:', import.meta.env.VITE_API_URL);
const fetchNoticias = () => {
    cargando.value = true;
    fetch(import.meta.env.VITE_API_URL + '/api/noticias/ultimas-noticias')
    .then(response => {
        if (!response.ok) {
            throw new Error(`¡Error HTTP! Estado: ${response.status}`);
        }
        return response.json();
    })
    .then(responseData => {
        console.log('Datos obtenidos:', responseData);
        cargando.value = false;
        if (responseData && responseData.data) {
            noticias.value = responseData.data;
        } else {
            throw new Error('Formato de respuesta inválido');
        }
    })
    .catch(error => {
        console.error('Error al obtener las noticias:', error);
        cargando.value = false;
        error.value = error.message;
    });
};

onMounted(() => {
    // Obtener noticias inmediatamente al montar
    fetchNoticias();
    
    // Configurar intervalo para actualizar cada 5 minutos (300000 ms)
    intervalId = setInterval(fetchNoticias, 300000);
});

// Limpiar el intervalo cuando el componente se desmonta
onBeforeUnmount(() => {
    if (intervalId) {
        clearInterval(intervalId);
    }
});
</script>

<template>
  <AsideComponent sectionTitle="Noticias Recientes">
    <div v-if="cargando" class="p-4 text-center">
      Cargando noticias...
    </div>
    <div v-else-if="error" class="p-4 text-center text-red-500">
      Error: {{ error }}
    </div>
    <div v-else class="space-y-4 pr-2">
      <AsideCard 
        v-for="(noticia, index) in noticias" 
        :key          = "index" 
        :titulo       = "noticia.titulo" 
        :fecha        = "noticia.fecha_publicacion" 
        :url          = "noticia.url"
        :periodico    = "noticia.periodico_nombre"
        :coeficiente  = Number(noticia.coeficiente)
      />
      <!-- Noticias de ejemplo como fallback -->
      <AsideCard 
        v-if="noticias.length === 0"
        :key="'noticia1'" 
        :titulo="'El gobierno anuncia nuevas medidas económicas para impulsar el crecimiento'" 
        :fecha="'2023-05-15'" 
        :url="'https://example.com/noticia1'"
        :periodico="'El Diario'"
        :coeficiente="0.2"
      />
      <AsideCard 
        v-if="noticias.length === 0"
        :key="'noticia2'" 
        :titulo="'Avances en la investigación de energías renovables prometen reducir emisiones de carbono'" 
        :fecha="'2023-05-14'" 
        :url="'https://example.com/noticia2'"
        :periodico="'Ciencia Hoy'"
        :coeficiente="-0.1"
      />
    </div>
  </AsideComponent>
</template>