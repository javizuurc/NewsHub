<script setup>
import Topic from './cards/tags/TopicTagComponent.vue'

defineProps({
  title: {
    type: String,
    required: true
  },
  topics: {
    type: Array,
    required: true
  },
  type: {
    type: String,
    required: true
  }
})
</script>

<template>
  <li>
    <h5 class="text-lg font-semibold text-[#be985d] mb-3 border-b border-[#b08d57] pb-2 font-cormorant">{{ title }}</h5>
    <div class="flex flex-wrap gap-2">
      <Topic 
        v-for="topic in topics" 
        :key="topic.name"
        :name="topic.name"
        :link="topic.link"
        :class="{ 'ring-1 ring-[#be985d]': topic.isPinned }"
        :type="type"
      />
    </div>
  </li>
</template>