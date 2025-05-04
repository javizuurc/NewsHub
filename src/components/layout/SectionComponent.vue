<script setup>
import { ref, onMounted } from 'vue';
import Modal from '../ui/modals/GrupoModal.vue';
const grupos = ref([]);
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
</script>

<template>
  <section class="flex-1 p-4 bg-white rounded-lg shadow">
    <h2 class="text-lg font-bold text-[#be985d] mb-3 border-b-2 border-[#b08d57] pb-2 text-center">
      Noticias Relevantes
    </h2>

    <div v-if="cargando" class="text-center text-gray-500">Cargando grupos...</div>
    <div v-else-if="error" class="text-center text-red-500">Error: {{ error }}</div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div 
        v-for="(grupo, index) in grupos"
        :key="index"
        class="cursor-pointer border border-yellow-400 bg-gray-50 p-4 rounded-xl hover:shadow-lg transition"
        @click="abrirModal(grupo)"
      >
        <h3 class="text-lg font-bold">{{ grupo.titular_general }}</h3>
        <p class="text-sm text-gray-600 mt-1">Contiene {{ grupo.noticias.length }} noticias</p>
      </div>
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
