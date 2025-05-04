import { createRouter, createWebHistory } from 'vue-router'
import Home from './views/Home.vue'
import Estadisticas from './views/Estadisticas.vue'
import NotFound from './views/errors/404.vue'  // Añadir esta importación

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
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router