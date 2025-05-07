<script setup>
  import instagramIcon from '/public/icons/rrss/claro/instagram.svg';
  import twitterIcon from '/public/icons/rrss/claro/x.svg';
  import linkedinIcon from '/public/icons/rrss/claro/linkedin.svg';

  const currentYear = new Date().getFullYear();
  
  const socialLinks = [
    {
      name: 'Instagram',
      url: '#',
      icon: instagramIcon
    },
    {
      name: 'Twitter',
      url: '#',
      icon: twitterIcon
    },
    {
      name: 'LinkedIn',
      url: '#',
      icon: linkedinIcon
    }
  ];
</script>

<template>
  <footer class="bg-[#2C2C2C] text-center text-white py-6 border-t-4 border-[#be985d]">
    <div class="container mx-auto">
      <div class="flex flex-col text-lg">
        <router-link to="/nosotros" class="hover:text-[#be985d] transition-colors duration-300">
          <p>Hecho por Javier Cruz Rojas & Manuel Villar Navarro</p>
        </router-link>
        <p>&copy; {{ currentYear }} NewsHub</p>
      </div>
      <div class="flex justify-center space-x-4 mt-4">
        <!--USAR ICONOS OFICIALES-->
        <a 
          v-for="(social, index) in socialLinks" 
          :key="index"
          :href="social.url" 
          class="text-[#C0C0C0] hover:text-[#be985d] transition-colors duration-300"
        >
          <span class="sr-only">{{ social.name }}</span>
          <img :src="social.icon" alt="" class="h-6 w-6" />
        </a>
      </div>
      
      <div class="mt-6 flex flex-wrap justify-center gap-4 text-sm">
        <a 
          v-for="(link, index) in socialLinks" 
          :key="index"
          :href="link.url" 
          class="text-[#C0C0C0] hover:text-[#be985d] transition-colors duration-300"
        >
        </a>
      </div>
    </div>
  </footer>
</template>