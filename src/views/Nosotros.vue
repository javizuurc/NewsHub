<script setup>
import NosotrosCard from '../components/ui/cards/NosotrosCard.vue';
import javiImage from '../assets/img/fotos/javi.jpg';
</script>

<template>
  <main class="flex-1 bg-gray-50">
    <div class="w-full py-16 bg-white">
      <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold mb-4 border-b-2 border-[#b08d57] pb-2 text-[#be985d] text-center font-cormorant">¿Quiénes somos?</h2>
          <p class="text-lg text-gray-600">
            Somos dos estudiantes apasionados por el Desarrollo de Aplicaciones Web. Nos une la creatividad, 
            el aprendizaje constante y el deseo de construir soluciones útiles e intuitivas.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <NosotrosCard
            nombre="Javier Cruz Rojas"
            :imagen="javiImage"
            descripcion="19 años, entusiasta de la teconología, lectura y los bonsais. He decidido hacer este proyecto
            no sólo para mi beneficio propio, sino para todas las personas con las mismas inquietudes que yo."
          />
          
          <NosotrosCard
            nombre="Manuel Villar Navarro"
            imagen=""
            descripcion="34 años y en continuo aprendizaje. 
                          Apasionado por la tecnología y por entender cómo funcionan las cosas por dentro, 
                          he encontrado en el desarrollo web una forma de combinar lógica con la creatividad."
          />
        </div>
      </div>
    </div>
  </main>
</template>

<style></style>