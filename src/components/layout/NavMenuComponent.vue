<script setup>
  import { ref } from 'vue';
  import ModalForm from '../ui/modals/ModalForm.vue';

  const mobileMenuOpen = ref(false);
  const showModal = ref(false);

  const toggleMobileMenu = () => {
    mobileMenuOpen.value = !mobileMenuOpen.value;
  };
  
  const openModal = () => {
    showModal.value = true;
  };
  
  const handleFormSubmit = (formData) => {
    console.log('Datos enviados:', formData);
    showModal.value = false;
  };
</script>

<template>
  <nav class="bg-[#2C2C2C] text-white p-4 shadow-xl border-b-4 border-[#be985d]">
    <div class="container mx-auto px-4 flex flex-row justify-between items-center">
      <div class="flex items-center">
        <button 
          @click="toggleMobileMenu" 
          class="block text-white hover:text-[#be985d] focus:outline-none mr-3 lg:hidden"
          aria-label="Menú"
        >
          <!-- Icono hamburguesa SVG -->
          <svg class="h-7 w-7" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
        </button>
        <div class="flex flex-row m5 justify-center items-center">
          <router-link to="/">
            <img src="/src/assets/Logo NewsHub.png" alt="Logo NewsHub" class="size-15">
          </router-link>
          <router-link to="/" 
            class="text-3xl text-white hover:text-[#C0C0C0] transition-all duration-500 transform hover:scale-105 ml-1 font-cormorant" 
            aria-label="NewsHub" id="nombre">
            NewsHub
          </router-link>
        </div>
      </div>
      <ul class="hidden lg:flex items-center space-x-6 mx-auto">
        <li><router-link to="/estadisticas" class="py-2 px-3 hover:text-[#be985d] transition-all duration-300 border-b-2 border-transparent hover:border-[#be985d]">Termómetro Nacional</router-link></li>
        <!--<li><a href="#" class="py-2 px-3 hover:text-[#be985d] transition-all duration-300 border-b-2 border-transparent hover:border-[#be985d]">¿Cómo sería si... ?</a></li>-->
        <li>
          <button 
            @click="openModal" 
            class="py-2 px-4 bg-[#5A5A5A] hover:bg-[#be985d] text-white rounded transition-colors duration-300"
          >
           Analiza tu propia noticia
          </button>
        </li>
        <li><router-link to="/nosotros" class="py-2 px-3 hover:text-[#be985d] transition-all duration-300 border-b-2 border-transparent hover:border-[#be985d]">Sobre nosotros</router-link></li>
      </ul>
    </div>

    <div 
      v-if="mobileMenuOpen" 
      class="block lg:hidden bg-[#3A3A3A] border-t border-[#be985d]/30 mt-2"
    >
      <ul class="flex flex-col py-2">
        <li><router-link to="/" class="block px-4 py-3 hover:bg-[#4A4A4A] hover:text-[#be985d] transition-colors duration-200">Inicio</router-link></li>
        <li><router-link to="/estadisticas" class="block px-4 py-3 hover:bg-[#4A4A4A] hover:text-[#be985d] transition-colors duration-200">Termómetro Nacional</router-link></li>
        <li>
          <button 
            @click="openModal" 
            class="w-full text-left px-4 py-3 hover:bg-[#4A4A4A] hover:text-[#be985d] transition-colors duration-200"
          >
            Analiza tu propia noticia
          </button>
        </li>
        <li><router-link to="/nosotros" class="block px-4 py-3 hover:bg-[#4A4A4A] hover:text-[#be985d] transition-colors duration-200">Sobre nosotros</router-link></li>
      </ul>
    </div>

    <ModalForm 
      v-if="showModal" 
      :show="showModal" 
      title="Analiza tu propia noticia" 
      @close="showModal = false"
      @submit="handleFormSubmit"
    />
  </nav>
</template>
