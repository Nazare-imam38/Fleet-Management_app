import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import MapView from '../views/MapView.vue'
import FleetManagement from '../views/FleetManagement.vue'
import RouteOptimization from '../views/RouteOptimization.vue'
import Analytics from '../views/Analytics.vue'
import Login from '../views/Login.vue'

const routes = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/map',
    name: 'MapView',
    component: MapView,
    meta: { requiresAuth: true }
  },
  {
    path: '/fleet',
    name: 'FleetManagement',
    component: FleetManagement,
    meta: { requiresAuth: true }
  },
  {
    path: '/optimization',
    name: 'RouteOptimization',
    component: RouteOptimization,
    meta: { requiresAuth: true }
  },
  {
    path: '/analytics',
    name: 'Analytics',
    component: Analytics,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guard for authentication
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('token')
  
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
  } else {
    next()
  }
})

export default router
