<script setup>
import BaseCardComponent from '../components/ui/cards/BaseCardComponent.vue';
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
          <BaseCardComponent>
            <div class="p-6">
              <h3 class="text-2xl font-bold text-gray-900 mb-3">Estudiante 1</h3>
              <div class="mb-4">
                <img src="" alt="Estudiante 1" class="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-4 border-amber-600">
              </div>
              <p class="text-gray-600 mb-4">
                Especializado en el desarrollo frontend con Vue.js y diseño de interfaces de usuario.
                Me apasiona crear experiencias web intuitivas y atractivas.
              </p>
              <div class="flex justify-center space-x-4">
                <span class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">Vue.js</span>
                <span class="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">UI/UX</span>
              </div>
            </div>
          </BaseCardComponent>

          <BaseCardComponent>
            <div class="p-6">
              <h3 class="text-2xl font-bold text-gray-900 mb-3">Estudiante 2</h3>
              <div class="mb-4">
                <img src="" alt="Estudiante 2" class="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-4 border-amber-600">
              </div>
              <p class="text-gray-600 mb-4">
                Enfocado en el desarrollo backend y la arquitectura de aplicaciones web.
                Me especializo en la creación de APIs robustas y eficientes.
              </p>
              <div class="flex justify-center space-x-4">
                <span class="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">Node.js</span>
                <span class="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">APIs</span>
              </div>
            </div>
          </BaseCardComponent>
        </div>
      </div>
    </div>
  </main>
</template>

<style></style>