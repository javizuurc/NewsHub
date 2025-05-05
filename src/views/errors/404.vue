<script setup>
import { useRouter } from 'vue-router';
const router = useRouter();

const goBack = () => {
  router.push('/');
};
</script>

<template>
  <main class="flex-1 bg-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
    <div class="max-w-lg w-full space-y-8 text-center">
      <div>
        <h1 class="text-9xl font-bold text-[#be985d] animate-bounce">404</h1>
        <h2 class="mt-6 text-3xl font-bold text-gray-900">
          ¡Ups! Te has perdido 🙈
        </h2>
        <p class="mt-4 text-lg text-gray-600">
          No te preocupes, estas cosas pasan. ¡Volvamos a un lugar seguro!
        </p>
      </div>
      
      <div class="mt-8">
        <button
          @click="goBack"
          class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#2C2C2C] hover:bg-[#be985d] hover:scale-105 transform transition-all duration-300"
        >
          <svg 
            class="w-5 h-5 mr-2" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              stroke-linecap="round" 
              stroke-linejoin="round" 
              stroke-width="2" 
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          ¡Sácame de aquí!
        </button>
      </div>
    </div>
  </main>
</template>