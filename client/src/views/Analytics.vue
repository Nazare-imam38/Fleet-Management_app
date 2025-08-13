<template>
  <div class="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
    <Sidebar />
    
    <div class="flex-1 ml-64 overflow-auto">
      <div class="p-8">
        <!-- Header -->
        <div class="mb-8">
          <h1 class="text-4xl font-bold gradient-text mb-3">Analytics</h1>
          <p class="text-slate-600 text-lg">Performance insights and operational metrics</p>
        </div>

        <!-- Date Range Selector -->
        <div class="card mb-8">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <label class="text-sm font-medium text-gray-700">Date Range:</label>
              <select v-model="selectedPeriod" class="input-field w-40">
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 90 Days</option>
                <option value="1y">Last Year</option>
              </select>
            </div>
            <div class="flex items-center space-x-2">
              <button @click="exportData" class="btn-secondary text-sm">
                <Download class="h-4 w-4 mr-1" />
                Export
              </button>
              <button @click="refreshData" class="btn-primary text-sm">
                <RefreshCw class="h-4 w-4 mr-1" />
                Refresh
              </button>
            </div>
          </div>
        </div>

        <!-- Key Metrics -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div class="card">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600">Total Deliveries</p>
                <p class="text-2xl font-bold text-gray-900">{{ metrics.totalDeliveries }}</p>
                <p class="text-sm text-green-600">+12% vs last period</p>
              </div>
              <div class="p-3 bg-blue-100 rounded-lg">
                <Package class="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div class="card">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600">On-Time Delivery</p>
                <p class="text-2xl font-bold text-gray-900">{{ metrics.onTimeDelivery }}%</p>
                <p class="text-sm text-green-600">+5% vs last period</p>
              </div>
              <div class="p-3 bg-green-100 rounded-lg">
                <Clock class="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div class="card">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600">Fuel Efficiency</p>
                <p class="text-2xl font-bold text-gray-900">{{ metrics.fuelEfficiency }} mpg</p>
                <p class="text-sm text-red-600">-2% vs last period</p>
              </div>
              <div class="p-3 bg-yellow-100 rounded-lg">
                <Fuel class="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div class="card">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600">Cost per Delivery</p>
                <p class="text-2xl font-bold text-gray-900">${{ metrics.costPerDelivery }}</p>
                <p class="text-sm text-green-600">-8% vs last period</p>
              </div>
              <div class="p-3 bg-purple-100 rounded-lg">
                <DollarSign class="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        <!-- Charts Section -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <!-- Delivery Performance Chart -->
          <div class="card">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Delivery Performance</h3>
            <div class="h-80">
              <LineChart :data="deliveryChartData" />
            </div>
          </div>

          <!-- Vehicle Utilization Chart -->
          <div class="card">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Vehicle Utilization</h3>
            <div class="h-80">
              <DoughnutChart :data="utilizationChartData" />
            </div>
          </div>
        </div>

        <!-- Detailed Analytics -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Top Performing Vehicles -->
          <div class="card">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Top Performing Vehicles</h3>
            <div class="space-y-4">
              <div v-for="vehicle in topVehicles" :key="vehicle.id" class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div class="flex items-center">
                  <div class="h-10 w-10 bg-primary-100 rounded-lg flex items-center justify-center mr-3">
                    <Truck class="h-5 w-5 text-primary-600" />
                  </div>
                  <div>
                    <p class="font-medium text-gray-900">{{ vehicle.name }}</p>
                    <p class="text-sm text-gray-500">{{ vehicle.driver }}</p>
                  </div>
                </div>
                <div class="text-right">
                  <p class="text-sm font-medium text-gray-900">{{ vehicle.deliveries }} deliveries</p>
                  <p class="text-xs text-gray-500">{{ vehicle.efficiency }}% efficiency</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Route Performance -->
          <div class="card">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Route Performance</h3>
            <div class="space-y-4">
              <div v-for="route in routePerformance" :key="route.id" class="border-b border-gray-100 pb-3 last:border-b-0">
                <div class="flex items-center justify-between mb-2">
                  <span class="font-medium text-gray-900">{{ route.name }}</span>
                  <span :class="`px-2 py-1 rounded-full text-xs font-medium ${getPerformanceClass(route.performance)}`">
                    {{ route.performance }}%
                  </span>
                </div>
                <div class="flex items-center justify-between text-sm text-gray-500">
                  <span>{{ route.distance }}km</span>
                  <span>{{ route.duration }}</span>
                  <span>{{ route.deliveries }} stops</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Cost Analysis -->
          <div class="card">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Cost Analysis</h3>
            <div class="space-y-4">
              <div v-for="cost in costBreakdown" :key="cost.category" class="flex items-center justify-between">
                <div class="flex items-center">
                  <div :class="`w-3 h-3 rounded-full ${cost.color} mr-3`"></div>
                  <span class="text-sm text-gray-700">{{ cost.category }}</span>
                </div>
                <div class="text-right">
                  <p class="text-sm font-medium text-gray-900">${{ cost.amount }}</p>
                  <p class="text-xs text-gray-500">{{ cost.percentage }}%</p>
                </div>
              </div>
            </div>
            <div class="mt-4 pt-4 border-t border-gray-200">
              <div class="flex items-center justify-between">
                <span class="font-medium text-gray-900">Total Cost</span>
                <span class="font-bold text-gray-900">${{ totalCost }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Performance Insights -->
        <div class="card mt-8">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Performance Insights</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div v-for="insight in insights" :key="insight.id" class="p-4 bg-gray-50 rounded-lg">
              <div class="flex items-start">
                <div :class="`p-2 rounded-lg ${insight.iconBg} mr-3`">
                  <component :is="insight.icon" class="h-4 w-4 text-white" />
                </div>
                <div>
                  <h4 class="font-medium text-gray-900 mb-1">{{ insight.title }}</h4>
                  <p class="text-sm text-gray-600">{{ insight.description }}</p>
                  <p class="text-xs text-gray-500 mt-2">{{ insight.recommendation }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import Sidebar from '../components/Sidebar.vue'
import LineChart from '../components/LineChart.vue'
import DoughnutChart from '../components/DoughnutChart.vue'
import { useToast } from 'vue-toastification'
import {
  Package,
  Clock,
  Fuel,
  DollarSign,
  Truck,
  Download,
  RefreshCw,
  TrendingUp,
  AlertTriangle,
  Target,
  Zap
} from 'lucide-vue-next'

const selectedPeriod = ref('30d')
const toast = useToast()

const metrics = ref({
  totalDeliveries: 1247,
  onTimeDelivery: 94.2,
  fuelEfficiency: 18.5,
  costPerDelivery: 23.45
})

const deliveryChartData = ref({
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [
    {
      label: 'Deliveries',
      data: [45, 52, 48, 61, 55, 42, 38],
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      tension: 0.4
    },
    {
      label: 'On-Time Rate',
      data: [92, 95, 89, 96, 94, 91, 88],
      borderColor: '#10b981',
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      tension: 0.4
    }
  ]
})

const utilizationChartData = ref({
  labels: ['Active', 'Idle', 'Maintenance'],
  datasets: [
    {
      data: [65, 25, 10],
      backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
      borderWidth: 0
    }
  ]
})

const topVehicles = ref([
  { id: 1, name: 'Truck-001', driver: 'John Smith', deliveries: 156, efficiency: 98 },
  { id: 2, name: 'Van-002', driver: 'Sarah Johnson', deliveries: 142, efficiency: 95 },
  { id: 3, name: 'Truck-003', driver: 'Mike Wilson', deliveries: 128, efficiency: 92 }
])

const routePerformance = ref([
  { id: 1, name: 'Downtown Route', performance: 96, distance: 45.2, duration: '4h 30m', deliveries: 8 },
  { id: 2, name: 'Airport Route', performance: 89, distance: 67.8, duration: '5h 15m', deliveries: 12 },
  { id: 3, name: 'Suburban Route', performance: 92, distance: 38.5, duration: '3h 45m', deliveries: 6 }
])

const costBreakdown = ref([
  { category: 'Fuel', amount: 12450, percentage: 45, color: 'bg-yellow-500' },
  { category: 'Maintenance', amount: 8230, percentage: 30, color: 'bg-blue-500' },
  { category: 'Labor', amount: 4560, percentage: 17, color: 'bg-green-500' },
  { category: 'Other', amount: 2150, percentage: 8, color: 'bg-purple-500' }
])

const insights = ref([
  {
    id: 1,
    title: 'Fuel Efficiency Decline',
    description: 'Average fuel efficiency has decreased by 2% this month.',
    recommendation: 'Consider route optimization and driver training to improve efficiency.',
    icon: Fuel,
    iconBg: 'bg-yellow-500'
  },
  {
    id: 2,
    title: 'Peak Delivery Times',
    description: 'Most deliveries occur between 9 AM and 2 PM.',
    recommendation: 'Consider expanding delivery windows to reduce congestion.',
    icon: Clock,
    iconBg: 'bg-blue-500'
  },
  {
    id: 3,
    title: 'High Performance Routes',
    description: 'Downtown route shows 96% on-time delivery rate.',
    recommendation: 'Apply similar optimization strategies to other routes.',
    icon: TrendingUp,
    iconBg: 'bg-green-500'
  },
  {
    id: 4,
    title: 'Maintenance Alerts',
    description: '3 vehicles require scheduled maintenance this week.',
    recommendation: 'Schedule maintenance during low-demand periods.',
    icon: AlertTriangle,
    iconBg: 'bg-red-500'
  }
])

const totalCost = computed(() => {
  return costBreakdown.value.reduce((sum, cost) => sum + cost.amount, 0).toLocaleString()
})

const getPerformanceClass = (performance) => {
  if (performance >= 95) return 'bg-green-100 text-green-800'
  if (performance >= 85) return 'bg-yellow-100 text-yellow-800'
  return 'bg-red-100 text-red-800'
}

const exportData = () => {
  toast.success('Data exported successfully')
}

const refreshData = () => {
  toast.info('Refreshing analytics data...')
  // Simulate data refresh
  setTimeout(() => {
    toast.success('Data refreshed successfully')
  }, 2000)
}

onMounted(() => {
  // Initialize analytics data
})
</script>
