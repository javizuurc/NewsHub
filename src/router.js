import { createRouter, createWebHistory } from 'vue-router'
import Home from './views/Home.vue'
import Estadisticas from './views/Estadisticas.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/estadisticas',
    name: 'Estadisticas',
    component: Estadisticas
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router