<script setup>
import { ref, onMounted } from 'vue';
import Modal from '../ui/modals/GrupoModal.vue';
import CardGrid from '../ui/cards/CardGridComponent.vue';

const grupos = ref([
  {
    titular_general: "Crisis climática: Nuevas medidas globales",
    imagen: "https://picsum.photos/800/600?random=1",
    noticias: [
      {
        id: 1,
        titulo: "La UE anuncia plan contra el cambio climático",
        periodico: "El País",
        justificacion: "Medida importante que afecta a toda Europa"
      },
      {
        id: 2,
        titulo: "España lidera iniciativas verdes en 2024",
        periodico: "El Mundo"
      }
    ]
  },
  {
    titular_general: "Avances en Inteligencia Artificial",
    imagen: "https://picsum.photos/800/600?random=2",
    noticias: [
      {
        id: 3,
        titulo: "Nueva IA supera pruebas médicas",
        periodico: "ABC",
        justificacion: "Revolución en diagnóstico médico"
      }
    ]
  },
  {
    titular_general: "Desarrollo tecnológico en España",
    imagen: "https://picsum.photos/800/600?random=3",
    noticias: [
      {
        id: 4,
        titulo: "Madrid se convierte en hub tecnológico",
        periodico: "El Confidencial"
      }
    ]
  },
  {
    titular_general: "Innovación en educación digital",
    imagen: "https://picsum.photos/800/600?random=4",
    noticias: [
      {
        id: 5,
        titulo: "Universidades implementan IA en enseñanza",
        periodico: "La Vanguardia"
      }
    ]
  },
  {
    titular_general: "Deportes: Final de temporada",
    imagen: "https://picsum.photos/800/600?random=5",
    noticias: [
      {
        id: 6,
        titulo: "Récord de audiencia en competiciones",
        periodico: "Marca"
      }
    ]
  },
  {
    titular_general: "Economía: Perspectivas 2024",
    imagen: "https://picsum.photos/800/600?random=6",
    noticias: [
      {
        id: 7,
        titulo: "Previsiones económicas positivas",
        periodico: "Expansión"
      }
    ]
  },
  {
    titular_general: "Cultura Digital",
    imagen: "https://picsum.photos/800/600?random=7",
    noticias: [
      {
        id: 8,
        titulo: "Museos virtuales ganan popularidad",
        periodico: "El Cultural"
      }
    ]
  }
]);
const cargando = ref(true);
const error = ref(null);
const modalVisible = ref(false);
const grupoSeleccionado = ref(null);

const fetchGrupos = () => {
  cargando.value = true;
  fetch(import.meta.env.VITE_API_URL + '/api/noticias/grupos-noticias')
    .then(res => res.json())
    .then(data => {
      grupos.value = data;
      cargando.value = false;
    })
    .catch(err => {
      console.error('Error al obtener grupos:', err);
      error.value = err.message;
      cargando.value = false;
    });
};

const abrirModal = (grupo) => {
  grupoSeleccionado.value = grupo;
  modalVisible.value = true;
};

const cerrarModal = () => {
  modalVisible.value = false;
};

onMounted(fetchGrupos);

const getGridClass = (index) => {
  const gridClasses = [
    'col-span-3 row-span-2',                    // 1
    'row-span-2 col-start-1 row-start-3',       // 2
    'col-span-2 row-span-2 col-start-2 row-start-3', // 3
    'col-span-2 row-span-3 col-start-4 row-start-1', // 4
    'col-span-2 col-start-1 row-start-5',       // 5
    'col-span-2 row-span-2 col-start-4 row-start-4', // 6
    'col-start-3 row-start-5'                   // 7
  ];
  return gridClasses[index] || '';
};
</script>

<template>
  <section class="flex-1 p-4 bg-white rounded-lg shadow">
    <h2 class="text-lg font-bold text-[#be985d] mb-3 border-b-2 border-[#b08d57] pb-2 text-center">
      Noticias Relevantes
    </h2>

    <div v-if="cargando" class="text-center text-gray-500">Cargando grupos...</div>
    <div v-else-if="error" class="text-center text-red-500">Error: {{ error }}</div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 auto-rows-min">
      <CardGrid
        v-for="(grupo, index) in grupos"
        :key="index"
        :class="getGridClass(index)"
        :title="grupo.titular_general"
        :content="[`Contiene ${grupo.noticias.length} noticias`]"
        :image-url="grupo.imagen || '/img/generica.jpg'"
        @click="abrirModal(grupo)"
      />
    </div>

    <Modal v-if="modalVisible && grupoSeleccionado" :grupo="grupoSeleccionado" @close="cerrarModal">
      <template #header>
        <h2 class="text-xl font-bold text-black">{{ grupoSeleccionado.titular_general }}</h2>
      </template>

      <template #body>
        <img 
          v-if="grupoSeleccionado.imagen" 
          :src="grupoSeleccionado.imagen" 
          alt="Imagen representativa" 
          class="w-full h-64 object-cover rounded-md mb-4" 
        />

        <div v-for="noticia in grupoSeleccionado.noticias" :key="noticia.id" class="mb-4 border p-3 rounded-md bg-white shadow-sm">
          <p class="font-semibold text-black">{{ noticia.titulo }}</p>
          <p class="text-sm text-gray-600">Periódico: {{ noticia.periodico }}</p>
          <p v-if="noticia.justificacion" class="text-xs text-gray-500 mt-1 italic">Justificación: {{ noticia.justificacion }}</p>
        </div>
      </template>
      </Modal>
  </section>
  </template>