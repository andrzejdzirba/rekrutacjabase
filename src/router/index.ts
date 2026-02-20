import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL || '/'),
  routes: [
    {
      path: '/',
      name: 'tickets',
      component: () => import('../views/TicketListView.vue'),
    },
    {
      path: '/ticket/:id',
      name: 'ticket-details',
      component: () => import('../views/TicketDetailsView.vue'),
      props: (route) => ({ id: Number(route.params.id) }),
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../views/NotFoundView.vue'),
    },
  ],
})

export default router
