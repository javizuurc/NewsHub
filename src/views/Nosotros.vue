<script setup>
import NosotrosCard from '../components/ui/cards/NosotrosCard.vue';
import javiImage from '../assets/img/foto/javi.jpg';
</script>

<template>
  <main class="flex-1 bg-gray-50">
    <div class="w-full py-16 bg-white">
      <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h1 class="text-4xl font-bold text-gray-900 mb-4">Sobre Nosotros</h1>
          <p class="text-lg text-gray-600">
            Somos dos estudiantes apasionados por el Desarrollo de Aplicaciones Web, 
            trabajando juntos para crear soluciones innovadoras.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <NosotrosCard
            nombre="Javier Cruz Rojas"
            :imagen="javiImage"
            descripcion="Descripción Genérica Turip Donald Trump jr."
            :tecnologias="[
              { nombre: 'Vue.js', bgColor: 'bg-blue-100', textColor: 'text-blue-800' },
              { nombre: 'UI/UX', bgColor: 'bg-green-100', textColor: 'text-green-800' }
            ]"
          />
          
          <NosotrosCard
            nombre="Manuel Villar Navarro"
            imagen=""
            descripcion="Me gusta el m&m amarillo."
            :tecnologias="[
              { nombre: 'Node.js', bgColor: 'bg-red-100', textColor: 'text-red-800' },
              { nombre: 'APIs', bgColor: 'bg-purple-100', textColor: 'text-purple-800' }
            ]"
          />
        </div>
      </div>
    </div>
  </main>
</template>

<style></style>