<script setup>
  const props = defineProps({
    customClass: {
      type: String,
      default: "",
    },
  });
</script>

<template>
  <article
    class="rounded-lg shadow-md transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg flex flex-col overflow-hidden"
    :class="customClass"
  >
    <slot></slot>
  </article>
</template>