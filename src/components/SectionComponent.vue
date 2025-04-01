<script setup>
  //import CardGridComponent from './cards/CardGridComponent.vue';
  import CardGrid from './cards/CardGridComponent.vue';

  const props = defineProps({
    sectionTitle: {
      type: String,
      required: true,
    },
  });

  // Define card data array for dynamic rendering
  const cardsStyles = [
    {
      type: 'large-left',
      class: "col-span-full md:col-span-3 md:row-span-3 shadow-lg border border-yellow-400 bg-white rounded-xl hover:shadow-xl transition duration-300 transform hover:-translate-y-1",
      title: "Create and Schedule Content Quicker",
      content: ['Create Post', 'Social Media 10x Faster with AI', 'Over 4,000 B-star reviews'],
      badge: "Nuevo",
      imageUrl: "/images/content-creation.jpg"
    },
    {
      type: 'vertical-right',
      class: "col-span-full md:col-span-2 md:row-span-3 md:col-start-4 shadow-lg border border-yellow-400 bg-white rounded-xl hover:shadow-xl transition duration-300 transform hover:-translate-y-1",
      title: "Maintain a Consistent Posting Schedule",
      content: ['August 2024 Week 1', 'Schedule to social media'],
      badge: "Popular",
      imageUrl: "/images/schedule.jpg"
    },
    {
      type: 'bottom-left',
      class: "col-span-full md:col-span-2 md:row-span-3 md:row-start-4 shadow-lg border border-yellow-400 bg-white rounded-xl hover:shadow-xl transition duration-300 transform hover:-translate-y-1",
      title: "Best Time to Post",
      content: ['Mon Tue Wed Thu', 'Most Active: 12a 3a 6a 9a 12p'],
      imageUrl: "/images/analytics.jpg"
    },
    {
      type: 'large-right',
      class: "col-span-full md:col-span-3 md:row-span-3 md:col-start-3 md:row-start-4 shadow-lg border border-yellow-400 bg-white rounded-xl hover:shadow-xl transition duration-300 transform hover:-translate-y-1",
      title: "Optimize Post Timings",
      content: ['Publish content at the perfect time for your audience'],
      imageUrl: "/images/timing.jpg"
    }
  ];
</script>

<template>
  <section class="flex-1 p-3 overflow-visible bg-gray-50 rounded-lg shadow-md shadow-black/5 my-4 md:my-0 md:mb-0 flex flex-col items-center h-auto">    
    <div class="grid grid-cols-1 md:grid-cols-5 md:grid-rows-6 gap-4 lg:gap-5 w-full max-w-6xl mx-auto flex-grow px-2 sm:gap-3 xs:gap-2 xs:pb-4 xs:px-2">  
      
      <CardGrid 
        v-for="(card, index) in cardsStyles" 
        :key="index"
        :class="card.class"
        :title="card.title"
        :content="card.content"
        :badge="card.badge"
        :imageUrl="card.imageUrl"
      />
    </div>
  </section>
</template>

<style scoped>
</style>
