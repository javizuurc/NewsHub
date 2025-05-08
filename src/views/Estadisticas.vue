<script setup>
import NewsAside from '../components/asides/NewsAside.vue';
import EstadisticaCard from '../components/ui/cards/EstadisticaCard.vue';
import NewsThermometerComponent from '../components/ui/thermometers/NewsThermometerComponent.vue';
import { onMounted, ref } from 'vue';
import axios from 'axios';

const contadorNoticias    = ref(null);
const contadorPeriodicos  = ref(null);
const mediaCalificaciones = ref(null);
const diasConNoticias     = ref(null);

const cargando  = ref(true);
const error     = ref(null);
const datosRaw  = ref({});

const API_URL = `${import.meta.env.VITE_API_URL}/api/noticias`;

const fetchContadorNoticias = async () => {
  try {
    const response = await axios.get(`${API_URL}/contar-noticias`);
    datosRaw.value.noticias = response.data;
    contadorNoticias.value = response.data;
    return response.data;
  } catch (error) {
    console.error('Error al obtener contador de noticias:', error);
    throw error;
  }
};

const fetchContadorPeriodicos = async () => {
  try {
    const response = await axios.get(`${API_URL}/contar-periodicos`);
    datosRaw.value.periodicos = response.data;
    contadorPeriodicos.value = response.data;
    return response.data;
  } catch (error) {
    console.error('Error al obtener contador de periódicos:', error);
    throw error;
  }
};

const fetchMediaCalificaciones = async () => {
  try {
    const response = await axios.get(`${API_URL}/media-calificaciones`);
    datosRaw.value.calificaciones = response.data;
    mediaCalificaciones.value = response.data;
    return response.data;
  } catch (error) {
    console.error('Error al obtener media de calificaciones:', error);
    throw error;
  }
};

const fetchDiasConNoticias = async () => {
  try {
    const response = await axios.get(`${API_URL}/dias-noticias`);
    datosRaw.value.diasConNoticias = response.data;
    diasConNoticias.value = response.data;
    return response.data;
  } catch (error) {
    console.error('Error al obtener días con noticias:', error);
    throw error;
  }
};

const recargarDatos = async () => {
  cargando.value  = true;
  error.value     = null;
  
  try {
    await Promise.all([
      fetchContadorNoticias(),
      fetchContadorPeriodicos(),
      fetchMediaCalificaciones(),
      fetchDiasConNoticias()
    ]);
  } catch (err) {
    console.error('Error al cargar datos:', err);
    error.value = 'Error al cargar los datos. Por favor, intenta de nuevo.';
  } finally {
    cargando.value = false;
  }
};

onMounted(() => {
  recargarDatos();
});
</script>

<template>
  <main class="flex flex-col md:flex-row flex-grow overflow-y-auto md:overflow-hidden bg-[#D9D9D9]">
    <NewsAside class="w-full md:w-1/4 lg:w-1/5 flex-shrink-0 md:h-full md:overflow-y-auto"></NewsAside>
    
    <div class="w-full md:w-3/4 lg:w-4/5 p-6 md:overflow-y-auto bg-white">
      <h4 class="text-xl font-bold mb-4 border-b-2 border-[#b08d57] pb-2 text-[#be985d] text-center">Estadísticas</h4>
      
      <div v-if="cargando" class="flex justify-center items-center h-64">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FFD700]"></div>
        <span class="ml-3 text-lg text-[#5A5A5A]">Cargando estadísticas...</span>
      </div>
      
      <div v-else-if="error" class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
        <p class="font-medium">{{ error }}</p>
        <button 
          @click="recargarDatos" 
          class="mt-3 px-4 py-2 bg-[#FFD700] text-[#2C2C2C] rounded hover:bg-[#FFC700] transition"
        >
          Reintentar
        </button>
      </div>
      
      <div v-if="!cargando && !error">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <EstadisticaCard 
            titulo="Noticias Registradas"
            :valor="contadorNoticias && contadorNoticias.data && contadorNoticias.data.length > 0 ? 
                   contadorNoticias.data[0]['COUNT(id)'] || '0' : '0'"
            descripcion="Total de noticias en la base de datos"
            :hayDatos="!!(contadorNoticias && contadorNoticias.data && contadorNoticias.data.length > 0)"
          />
          
          <EstadisticaCard 
            titulo="Días scrapeados"
            :valor="diasConNoticias && diasConNoticias.dias_con_noticias ? diasConNoticias.dias_con_noticias : '0'"
            descripcion="Días distintos en los que se han recopilado noticias"
            :hayDatos="!!(diasConNoticias && diasConNoticias.dias_con_noticias)"
          />

          <EstadisticaCard 
            titulo="Periódicos Registrados"
            :valor="contadorPeriodicos && contadorPeriodicos.data && contadorPeriodicos.data.length > 0 ? 
                   contadorPeriodicos.data[0]['count(id)'] || '0' : '0'"
            descripcion="Fuentes de noticias activas"
            :hayDatos="!!(contadorPeriodicos && contadorPeriodicos.data && contadorPeriodicos.data.length > 0)"
          />
        </div>
        
        <div class="bg-white rounded-lg shadow-lg overflow-hidden border-t-4 border-[#C0C0C0] p-5 mb-6">
          <h2 class="text-xl font-semibold text-[#2C2C2C] mb-4">Media de Calificaciones</h2>
          <div v-if="mediaCalificaciones && mediaCalificaciones.data && mediaCalificaciones.data.length > 0">
            <div class="flex flex-col items-center">
              <div class="w-full max-w-2xl">
                <NewsThermometerComponent 
                  :coeficiente="mediaCalificaciones.data[0]['AVG(coeficiente)']"
                  :showValue="false"
                  height="h-8"
                />
                <p class="text-center font-bold text-lg mt-2 text-[#2C2C2C]">
                  {{ mediaCalificaciones.data[0]['AVG(coeficiente)'].toFixed(5) }}
                </p>
              </div>
              <p class="text-sm text-[#5A5A5A] mt-4 text-center">
                Promedio de tendencia ideológica de todas las noticias
              </p>
            </div>
          </div>
          <div v-else class="text-[#5A5A5A] italic text-center">
            No hay datos disponibles
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style>
@media (max-width: 768px) {
  main {
    height: auto;
    min-height: 0;
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>