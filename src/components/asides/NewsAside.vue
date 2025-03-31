<script setup>
import { ref, onMounted } from 'vue';
import AsideCard from '../cards/NewsCardComponent.vue';
import AsideComponent from './AsideComponent.vue';

const noticias = ref([]);
const cargando = ref(true);
const error = ref(null);

onMounted(() => {
    fetch('/obtener_noticias.php', {
        headers: {'Content-Type': 'application/json'}
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.text().then(text => {
            if (!text) {
                throw new Error('Empty response received');
            }
            try {
                return JSON.parse(text);
            } catch (e) {
                console.error('Invalid JSON:', text);
                throw new Error('Invalid JSON response');
            }
        });
    })
    .then(data => {
        console.log('Datos obtenidos:', data);
        cargando.value = false;
        if (!data.error) noticias.value = data;
    })
    .catch(error => {
        console.error('Error al obtener las noticias:', error);
        cargando.value = false;
        error.value = error.message;
    });
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