<script setup>
  import { ref, onMounted } from 'vue'
  import AsideComponent from './AsideComponent.vue';
  import TopicSection from '../TopicSection.vue'
  import TopicTag from '../cards/tags/TopicTagComponent.vue'

  const topics = ref({
    daily: [
      {}
    ],
    weekly: [
      { name: 'Inteligencia Artificial', link: '#' },
      { name: 'Cambio Climático', link: '#' },
      { name: 'Política', link: '#' },
      { name: 'Salud', link: '#' },
      { name: 'Educación', link: '#' },
    ],
    custom: [
      { name: 'Mis Temas', link: '#' },
      { name: 'Favoritos', link: '#' },
      { name: 'Guardados', link: '#' },
    ]
  })

  const obtenerTopicsDiarios = async () => {
    try {
      const response = await fetch('/obtener_topics.php')
      
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`)
      }
      
      const data = await response.json()
      const pinnedTopics = topics.value.daily.filter(topic => topic.isPinned)
      
      const apiTopics = data.map(item => ({
        name: item.nombre || item.palabra,
        link: '#',
        isPinned: false
      }))
      
      topics.value.daily = [...pinnedTopics, ...apiTopics]
      
    } catch (error) {
      console.error('Error obteniendo trending topics:', error)
      const mockData = [
        { palabra: 'Deportes' },
        { palabra: 'Economía' },
        { palabra: 'Ciencia' },
        { palabra: 'Cultura' }
      ];
      
      const pinnedTopics = topics.value.daily.filter(topic => topic.isPinned)
      const apiTopics = mockData.map(item => ({
        name: item.palabra,
        link: '#',
        isPinned: false
      }))
      
      topics.value.daily = [...pinnedTopics, ...apiTopics]
    }
  }

  onMounted(obtenerTopicsDiarios)
</script>

<template>
  <AsideComponent 
    sectionTitle="Tópicos" 
    class="bg-[#2C2C2C] rounded-lg shadow-md shadow-black/10"
    titleClass="text-[#be985d] border-[#b08d57] text-xl tracking-wide"
  >
    <ul class="space-y-6">
      <TopicSection 
        title="Tópicos Diarios" 
        :topics="topics.daily" 
        type="daily" 
      />
      
      <TopicSection 
        title="Tópicos Semanales" 
        :topics="topics.weekly" 
        type="weekly" 
      />
      
      <TopicSection 
        title="Tópicos Personalizados" 
        :topics="topics.custom" 
        type="custom" 
      />
    </ul>
  </AsideComponent>
</template>