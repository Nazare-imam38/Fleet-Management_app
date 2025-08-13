<template>
  <div class="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
    <Sidebar />
    
    <div class="flex-1 ml-64 overflow-auto">
      <div class="p-8">
        <!-- Header -->
        <div class="mb-8">
          <h1 class="text-4xl font-bold gradient-text mb-3">Dashboard</h1>
          <p class="text-slate-600 text-lg">Real-time overview of your logistics operations</p>
        </div>

        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div class="card group hover:bg-gradient-to-br hover:from-green-50 hover:to-emerald-50">
            <div class="flex items-center">
              <div class="p-4 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Truck class="h-7 w-7 text-white" />
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-slate-600">Active Vehicles</p>
                <p class="text-3xl font-bold gradient-text">{{ stats.activeVehicles }}</p>
                <p class="text-sm text-accent-600 flex items-center">
                  <span class="inline-block w-2 h-2 bg-accent-500 rounded-full mr-2 animate-pulse"></span>
                  +5% from last week
                </p>
              </div>
            </div>
          </div>

          <div class="card group hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50">
            <div class="flex items-center">
              <div class="p-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Route class="h-7 w-7 text-white" />
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-slate-600">Active Routes</p>
                <p class="text-3xl font-bold gradient-text">{{ stats.activeRoutes }}</p>
                <p class="text-sm text-accent-600 flex items-center">
                  <span class="inline-block w-2 h-2 bg-accent-500 rounded-full mr-2 animate-pulse"></span>
                  +12% from last week
                </p>
              </div>
            </div>
          </div>

          <div class="card group hover:bg-gradient-to-br hover:from-warning-50 hover:to-orange-50">
            <div class="flex items-center">
              <div class="p-4 bg-gradient-to-br from-warning-500 to-orange-600 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Package class="h-7 w-7 text-white" />
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-slate-600">Pending Deliveries</p>
                <p class="text-3xl font-bold gradient-text">{{ stats.pendingDeliveries }}</p>
                <p class="text-sm text-accent-600 flex items-center">
                  <span class="inline-block w-2 h-2 bg-accent-500 rounded-full mr-2 animate-pulse"></span>
                  +8% from last week
                </p>
              </div>
            </div>
          </div>

          <div class="card group hover:bg-gradient-to-br hover:from-secondary-50 hover:to-purple-50">
            <div class="flex items-center">
              <div class="p-4 bg-gradient-to-br from-secondary-500 to-purple-600 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <TrendingUp class="h-7 w-7 text-white" />
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-slate-600">Efficiency Score</p>
                <p class="text-3xl font-bold gradient-text">{{ stats.efficiencyScore }}%</p>
                <p class="text-sm text-accent-600 flex items-center">
                  <span class="inline-block w-2 h-2 bg-accent-500 rounded-full mr-2 animate-pulse"></span>
                  +3% from last week
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Charts and Maps -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <!-- Delivery Performance Chart -->
          <div class="card">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Delivery Performance</h3>
            <div class="h-64">
              <LineChart :data="deliveryChartData" />
            </div>
          </div>

          <!-- Vehicle Status -->
          <div class="card">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Vehicle Status</h3>
            <div class="space-y-4">
              <div v-for="vehicle in recentVehicles" :key="vehicle.id" class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div class="flex items-center space-x-3">
                  <div :class="`w-3 h-3 rounded-full ${getStatusColor(vehicle.status)}`"></div>
                  <div>
                    <p class="font-medium text-gray-900">{{ vehicle.name }}</p>
                    <p class="text-sm text-gray-500">{{ vehicle.driver }}</p>
                  </div>
                </div>
                <div class="text-right">
                  <p class="text-sm font-medium text-gray-900">{{ vehicle.location }}</p>
                  <p class="text-xs text-gray-500">{{ vehicle.eta }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Activity -->
        <div class="card">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div class="space-y-4">
            <div v-for="activity in recentActivities" :key="activity.id" class="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <div :class="`p-2 rounded-lg ${getActivityIconBg(activity.type)}`">
                <component :is="getActivityIcon(activity.type)" class="h-4 w-4 text-white" />
              </div>
              <div class="flex-1">
                <p class="text-sm font-medium text-gray-900">{{ activity.title }}</p>
                <p class="text-xs text-gray-500">{{ activity.description }}</p>
              </div>
              <span class="text-xs text-gray-400">{{ formatTime(activity.timestamp) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAppStore } from '../stores/app'
import Sidebar from '../components/Sidebar.vue'
import LineChart from '../components/LineChart.vue'
import {
  Truck,
  Route,
  Package,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Clock,
  MapPin
} from 'lucide-vue-next'

const appStore = useAppStore()

const stats = ref({
  activeVehicles: 12,
  activeRoutes: 8,
  pendingDeliveries: 45,
  efficiencyScore: 94
})

const deliveryChartData = ref({
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [
    {
      label: 'Completed',
      data: [65, 78, 82, 75, 89, 92, 85],
      borderColor: '#10b981',
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      tension: 0.4
    },
    {
      label: 'Pending',
      data: [12, 8, 15, 10, 6, 4, 8],
      borderColor: '#f59e0b',
      backgroundColor: 'rgba(245, 158, 11, 0.1)',
      tension: 0.4
    }
  ]
})

const recentVehicles = ref([
  { id: 1, name: 'Truck-001', driver: 'John Smith', status: 'active', location: 'Downtown', eta: '15 min' },
  { id: 2, name: 'Van-002', driver: 'Sarah Johnson', status: 'idle', location: 'Warehouse', eta: 'N/A' },
  { id: 3, name: 'Truck-003', driver: 'Mike Wilson', status: 'active', location: 'Airport', eta: '32 min' },
  { id: 4, name: 'Van-004', driver: 'Lisa Brown', status: 'maintenance', location: 'Service Center', eta: 'N/A' }
])

const recentActivities = ref([
  { id: 1, type: 'delivery', title: 'Delivery Completed', description: 'Package delivered to 123 Main St', timestamp: new Date(Date.now() - 5 * 60000) },
  { id: 2, type: 'route', title: 'Route Optimized', description: 'New route calculated for Truck-001', timestamp: new Date(Date.now() - 15 * 60000) },
  { id: 3, type: 'alert', title: 'Traffic Alert', description: 'Heavy traffic detected on Route 5', timestamp: new Date(Date.now() - 30 * 60000) },
  { id: 4, type: 'vehicle', title: 'Vehicle Added', description: 'New vehicle Truck-005 registered', timestamp: new Date(Date.now() - 45 * 60000) }
])

const getStatusColor = (status) => {
  const colors = {
    active: 'bg-green-500',
    idle: 'bg-gray-400',
    maintenance: 'bg-red-500'
  }
  return colors[status] || 'bg-gray-400'
}

const getActivityIcon = (type) => {
  const icons = {
    delivery: CheckCircle,
    route: Route,
    alert: AlertCircle,
    vehicle: Truck
  }
  return icons[type] || Clock
}

const getActivityIconBg = (type) => {
  const colors = {
    delivery: 'bg-green-500',
    route: 'bg-blue-500',
    alert: 'bg-yellow-500',
    vehicle: 'bg-purple-500'
  }
  return colors[type] || 'bg-gray-500'
}

const formatTime = (timestamp) => {
  const now = new Date()
  const diff = now - timestamp
  const minutes = Math.floor(diff / 60000)
  
  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  return `${hours}h ago`
}

onMounted(() => {
  // Initialize with mock data
  appStore.setVehicles(recentVehicles.value)
})
</script>
