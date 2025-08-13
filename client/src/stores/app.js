import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAppStore = defineStore('app', () => {
  // State
  const user = ref(null)
  const vehicles = ref([])
  const routes = ref([])
  const deliveries = ref([])
  const isLoading = ref(false)
  const notifications = ref([])

  // Getters
  const isAuthenticated = computed(() => !!user.value)
  const activeVehicles = computed(() => vehicles.value.filter(v => v.status === 'active'))
  const pendingDeliveries = computed(() => deliveries.value.filter(d => d.status === 'pending'))
  const completedDeliveries = computed(() => deliveries.value.filter(d => d.status === 'completed'))

  // Actions
  const setUser = (userData) => {
    user.value = userData
  }

  const setVehicles = (vehiclesData) => {
    vehicles.value = vehiclesData
  }

  const setRoutes = (routesData) => {
    routes.value = routesData
  }

  const setDeliveries = (deliveriesData) => {
    deliveries.value = deliveriesData
  }

  const addNotification = (notification) => {
    notifications.value.push({
      id: Date.now(),
      ...notification,
      timestamp: new Date()
    })
  }

  const removeNotification = (id) => {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index > -1) {
      notifications.value.splice(index, 1)
    }
  }

  const logout = () => {
    user.value = null
    vehicles.value = []
    routes.value = []
    deliveries.value = []
    localStorage.removeItem('token')
  }

  return {
    // State
    user,
    vehicles,
    routes,
    deliveries,
    isLoading,
    notifications,
    
    // Getters
    isAuthenticated,
    activeVehicles,
    pendingDeliveries,
    completedDeliveries,
    
    // Actions
    setUser,
    setVehicles,
    setRoutes,
    setDeliveries,
    addNotification,
    removeNotification,
    logout
  }
})
