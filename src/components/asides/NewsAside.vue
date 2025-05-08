<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import AsideCard from '../ui/cards/NewsCardComponent.vue';
import AsideComponent from './AsideComponent.vue';

const noticias = ref([]);
const cargando = ref(true);
const error = ref(null);
let intervalId = null;

const fetchNoticias = () => {
    cargando.value = true;
    fetch(import.meta.env.VITE_API_URL + '/api/noticias/ultimas-noticias')
    .then(response => {
      if (!response.ok) throw new Error(`¡Error HTTP! Estado: ${response.status}`);
      return response.json();
    })
    .then(responseData => {
      cargando.value = false;
      noticias.value = responseData && responseData.data ? responseData.data : [];
    })
    .catch(error => {
      console.error('Error al obtener las noticias:', error);
      cargando.value = false;
      error.value = error.message;
    });
};

onMounted(() => {
  fetchNoticias();
  intervalId = setInterval(fetchNoticias, 600000);
});

onBeforeUnmount(() => {
    if (intervalId) {
        clearInterval(intervalId);
    }
});
</script>

<template>
  <AsideComponent sectionTitle="Noticias Recientes">
    <div v-if="cargando" class="p-4 text-center">
      <p>Cargando noticias...</p>
    </div>
    <div v-else-if="error" class="p-4 text-center text-red-500">
      <ErrorTexto v-if="error" :mensaje="error" />
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
    </div>
  </AsideComponent>
</template>