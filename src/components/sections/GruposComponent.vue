<script setup>
import { ref, onMounted } from 'vue';
import Modal from '../ui/modals/GrupoModal.vue';
import CardGrid from '../ui/cards/CardGridComponent.vue';

const grupos = ref([]);
const cargando = ref(true);
const error = ref(null);
const modalVisible = ref(false);
const grupoSeleccionado = ref(null);

const fetchGrupos = () => {
  cargando.value = true;
  fetch(import.meta.env.VITE_API_URL + '/api/noticias/grupos-noticias')
    .then(res => {
      if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);
      return res.json();
    })
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

// Solo aplicamos clases si estamos en resolución lg+
const getGridClass = (index) => {
  const gridClasses = [
    'lg:col-span-3 lg:row-span-2',
    'lg:row-span-2 lg:col-start-1 lg:row-start-3',
    'lg:col-span-2 lg:row-span-2 lg:col-start-2 lg:row-start-3',
    'lg:col-span-2 lg:row-span-3 lg:col-start-4 lg:row-start-1',
    'lg:col-span-2 lg:col-start-1 lg:row-start-5',
    'lg:col-span-2 lg:row-span-2 lg:col-start-4 lg:row-start-4',
    'lg:col-start-3 lg:row-start-5'
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

    <!-- Flex en móviles, grid en lg+ -->
    <div class="flex flex-col gap-4 lg:grid lg:grid-cols-4 xl:grid-cols-5 lg:auto-rows-auto">
      <div v-if="grupos.length === 0" class="col-span-full text-center text-gray-500">
        No hay grupos de noticias disponibles
      </div>

      <CardGrid
        v-else
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
        <div
          v-for="noticia in grupoSeleccionado.noticias"
          :key="noticia.id"
          class="mb-4 border p-3 rounded-md bg-white shadow-sm"
        >
          <a
            v-if="noticia.url"
            :href="noticia.url"
            target="_blank"
            rel="noopener noreferrer"
            class="font-semibold text-black hover:underline"
          >
            {{ noticia.titulo }}
          </a>
          <span v-else class="font-semibold text-black">{{ noticia.titulo }}</span>
          <p class="text-sm text-gray-600">Periódico: {{ noticia.periodico }}</p>
          <div
            v-if="noticia.justificacion"
            class="text-xs text-gray-500 mt-1 italic"
          >
            Justificación:
            <ul v-if="Array.isArray(noticia.justificacion)" class="list-disc pl-4">
              <li v-for="(item, idx) in noticia.justificacion" :key="idx"> {{ item }} </li>
            </ul>
            <span v-else>
              {{ noticia.justificacion }}
            </span>
          </div>
        </div>
      </template>
    </Modal>
  </section>
</template>
