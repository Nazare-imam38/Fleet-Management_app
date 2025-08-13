<template>
  <div class="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
    <Sidebar />
    
    <div class="flex-1 ml-64 overflow-auto">
      <div class="p-8">
        <!-- Header -->
        <div class="mb-8">
          <h1 class="text-4xl font-bold gradient-text mb-3">Route Optimization</h1>
          <p class="text-slate-600 text-lg">Optimize delivery routes using advanced algorithms</p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Configuration Panel -->
          <div class="lg:col-span-1 space-y-6">
            <!-- Algorithm Selection -->
            <div class="card">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Optimization Algorithm</h3>
              <div class="space-y-3">
                <label class="flex items-center">
                  <input v-model="selectedAlgorithm" type="radio" value="vrp" class="mr-3" />
                  <div>
                    <p class="font-medium text-gray-900">Vehicle Routing Problem (VRP)</p>
                    <p class="text-sm text-gray-500">Standard multi-vehicle routing</p>
                  </div>
                </label>
                <label class="flex items-center">
                  <input v-model="selectedAlgorithm" type="radio" value="darp" class="mr-3" />
                  <div>
                    <p class="font-medium text-gray-900">Dial-a-Ride Problem (DARP)</p>
                    <p class="text-sm text-gray-500">Time-window constrained routing</p>
                  </div>
                </label>
                <label class="flex items-center">
                  <input v-model="selectedAlgorithm" type="radio" value="genetic" class="mr-3" />
                  <div>
                    <p class="font-medium text-gray-900">Genetic Algorithm</p>
                    <p class="text-sm text-gray-500">Evolutionary optimization</p>
                  </div>
                </label>
              </div>
            </div>

            <!-- Optimization Parameters -->
            <div class="card">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Parameters</h3>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Max Route Duration (hours)</label>
                  <input v-model="params.maxDuration" type="number" class="input-field" min="1" max="24" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Vehicle Capacity (kg)</label>
                  <input v-model="params.capacity" type="number" class="input-field" min="100" max="5000" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Time Window (minutes)</label>
                  <input v-model="params.timeWindow" type="number" class="input-field" min="15" max="120" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Fuel Efficiency Priority</label>
                  <select v-model="params.fuelPriority" class="input-field">
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Available Vehicles -->
            <div class="card">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Available Vehicles</h3>
              <div class="space-y-3">
                <div v-for="vehicle in availableVehicles" :key="vehicle.id" class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div class="flex items-center">
                    <input v-model="selectedVehicles" :value="vehicle.id" type="checkbox" class="mr-3" />
                    <div>
                      <p class="font-medium text-gray-900">{{ vehicle.name }}</p>
                      <p class="text-sm text-gray-500">{{ vehicle.capacity }}kg capacity</p>
                    </div>
                  </div>
                  <span :class="`px-2 py-1 rounded-full text-xs font-medium ${getVehicleStatusClass(vehicle.status)}`">
                    {{ vehicle.status }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Optimization Button -->
            <button @click="optimizeRoutes" :disabled="isOptimizing" class="w-full btn-primary flex items-center justify-center">
              <Loader v-if="isOptimizing" class="animate-spin h-4 w-4 mr-2" />
              {{ isOptimizing ? 'Optimizing...' : 'Optimize Routes' }}
            </button>
          </div>

          <!-- Delivery Points & Results -->
          <div class="lg:col-span-2 space-y-6">
            <!-- Delivery Points -->
            <div class="card">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-semibold text-gray-900">Delivery Points</h3>
                <button @click="showAddPoint = true" class="btn-secondary text-sm">
                  <Plus class="h-4 w-4 mr-1" />
                  Add Point
                </button>
              </div>
              
              <div class="overflow-x-auto">
                <table class="w-full">
                  <thead>
                    <tr class="border-b border-gray-200">
                      <th class="text-left py-2 px-3 font-medium text-gray-900">Location</th>
                      <th class="text-left py-2 px-3 font-medium text-gray-900">Priority</th>
                      <th class="text-left py-2 px-3 font-medium text-gray-900">Time Window</th>
                      <th class="text-left py-2 px-3 font-medium text-gray-900">Weight</th>
                      <th class="text-left py-2 px-3 font-medium text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="point in deliveryPoints" :key="point.id" class="border-b border-gray-100">
                      <td class="py-3 px-3">
                        <div>
                          <p class="font-medium text-gray-900">{{ point.address }}</p>
                          <p class="text-sm text-gray-500">{{ point.coordinates.join(', ') }}</p>
                        </div>
                      </td>
                      <td class="py-3 px-3">
                        <span :class="`px-2 py-1 rounded-full text-xs font-medium ${getPriorityClass(point.priority)}`">
                          {{ point.priority }}
                        </span>
                      </td>
                      <td class="py-3 px-3 text-sm text-gray-900">{{ point.timeWindow }}</td>
                      <td class="py-3 px-3 text-sm text-gray-900">{{ point.weight }}kg</td>
                      <td class="py-3 px-3">
                        <button @click="removePoint(point.id)" class="text-red-600 hover:text-red-800">
                          <Trash2 class="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Optimization Results -->
            <div v-if="optimizationResults" class="card">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Optimization Results</h3>
              
              <!-- Summary Stats -->
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div class="text-center p-3 bg-blue-50 rounded-lg">
                  <p class="text-2xl font-bold text-blue-600">{{ optimizationResults.totalDistance }}km</p>
                  <p class="text-sm text-gray-600">Total Distance</p>
                </div>
                <div class="text-center p-3 bg-green-50 rounded-lg">
                  <p class="text-2xl font-bold text-green-600">{{ optimizationResults.totalTime }}h</p>
                  <p class="text-sm text-gray-600">Total Time</p>
                </div>
                <div class="text-center p-3 bg-purple-50 rounded-lg">
                  <p class="text-2xl font-bold text-purple-600">{{ optimizationResults.vehiclesUsed }}</p>
                  <p class="text-sm text-gray-600">Vehicles Used</p>
                </div>
                <div class="text-center p-3 bg-yellow-50 rounded-lg">
                  <p class="text-2xl font-bold text-yellow-600">{{ optimizationResults.efficiency }}%</p>
                  <p class="text-sm text-gray-600">Efficiency</p>
                </div>
              </div>

              <!-- Route Details -->
              <div class="space-y-4">
                <div v-for="route in optimizationResults.routes" :key="route.id" class="border border-gray-200 rounded-lg p-4">
                  <div class="flex items-center justify-between mb-3">
                    <h4 class="font-semibold text-gray-900">{{ route.vehicle }}</h4>
                    <span class="text-sm text-gray-500">{{ route.distance }}km • {{ route.duration }}</span>
                  </div>
                  <div class="space-y-2">
                    <div v-for="(stop, index) in route.stops" :key="index" class="flex items-center text-sm">
                      <div class="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                        <span class="text-xs font-medium text-primary-600">{{ index + 1 }}</span>
                      </div>
                      <span class="text-gray-900">{{ stop.address }}</span>
                      <span class="ml-auto text-gray-500">{{ stop.eta }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="flex space-x-3 mt-6">
                <button class="btn-primary">Apply Routes</button>
                <button class="btn-secondary">Export Results</button>
                <button class="btn-secondary">Save Configuration</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Delivery Point Modal -->
    <div v-if="showAddPoint" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Add Delivery Point</h3>
        <form @submit.prevent="addDeliveryPoint" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <input v-model="newPoint.address" type="text" class="input-field" required />
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
              <input v-model="newPoint.coordinates[0]" type="number" step="0.000001" class="input-field" required />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
              <input v-model="newPoint.coordinates[1]" type="number" step="0.000001" class="input-field" required />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Priority</label>
            <select v-model="newPoint.priority" class="input-field" required>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Time Window</label>
            <input v-model="newPoint.timeWindow" type="text" class="input-field" placeholder="9:00 AM - 5:00 PM" required />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
            <input v-model="newPoint.weight" type="number" class="input-field" min="1" required />
          </div>
          <div class="flex space-x-3">
            <button type="button" @click="showAddPoint = false" class="flex-1 btn-secondary">
              Cancel
            </button>
            <button type="submit" class="flex-1 btn-primary">
              Add Point
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import Sidebar from '../components/Sidebar.vue'
import { useToast } from 'vue-toastification'
import {
  Plus,
  Loader,
  Trash2
} from 'lucide-vue-next'

const selectedAlgorithm = ref('vrp')
const isOptimizing = ref(false)
const showAddPoint = ref(false)
const toast = useToast()
const selectedVehicles = ref([])
const optimizationResults = ref(null)

const params = ref({
  maxDuration: 8,
  capacity: 1000,
  timeWindow: 30,
  fuelPriority: 'medium'
})

const availableVehicles = ref([
  { id: 1, name: 'Truck-001', capacity: 2000, status: 'available' },
  { id: 2, name: 'Van-002', capacity: 800, status: 'available' },
  { id: 3, name: 'Truck-003', capacity: 1500, status: 'maintenance' }
])

const deliveryPoints = ref([
  {
    id: 1,
    address: '123 Main St, Downtown',
    coordinates: [40.7128, -74.0060],
    priority: 'high',
    timeWindow: '9:00 AM - 5:00 PM',
    weight: 150
  },
  {
    id: 2,
    address: '456 Oak Ave, Midtown',
    coordinates: [40.7589, -73.9851],
    priority: 'medium',
    timeWindow: '10:00 AM - 6:00 PM',
    weight: 200
  },
  {
    id: 3,
    address: '789 Pine St, Uptown',
    coordinates: [40.7505, -73.9934],
    priority: 'low',
    timeWindow: '11:00 AM - 7:00 PM',
    weight: 100
  }
])

const newPoint = ref({
  address: '',
  coordinates: [0, 0],
  priority: 'medium',
  timeWindow: '',
  weight: 0
})

const getVehicleStatusClass = (status) => {
  const classes = {
    available: 'bg-green-100 text-green-800',
    maintenance: 'bg-red-100 text-red-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const getPriorityClass = (priority) => {
  const classes = {
    high: 'bg-red-100 text-red-800',
    medium: 'bg-yellow-100 text-yellow-800',
    low: 'bg-green-100 text-green-800'
  }
  return classes[priority] || 'bg-gray-100 text-gray-800'
}

const addDeliveryPoint = () => {
  const point = {
    id: Date.now(),
    ...newPoint.value
  }
  
  deliveryPoints.value.push(point)
  showAddPoint.value = false
  newPoint.value = {
    address: '',
    coordinates: [0, 0],
    priority: 'medium',
    timeWindow: '',
    weight: 0
  }
  toast.success('Delivery point added successfully')
}

const removePoint = (id) => {
  deliveryPoints.value = deliveryPoints.value.filter(p => p.id !== id)
  toast.success('Delivery point removed')
}

const optimizeRoutes = async () => {
  if (deliveryPoints.value.length === 0) {
    toast.error('Please add delivery points first')
    return
  }
  
  if (selectedVehicles.value.length === 0) {
    toast.error('Please select at least one vehicle')
    return
  }
  
  isOptimizing.value = true
  
  try {
    // Simulate optimization process
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    optimizationResults.value = {
      totalDistance: 156.8,
      totalTime: 8.5,
      vehiclesUsed: 2,
      efficiency: 94,
      routes: [
        {
          id: 1,
          vehicle: 'Truck-001',
          distance: 89.2,
          duration: '4h 30m',
          stops: [
            { address: '123 Main St, Downtown', eta: '9:30 AM' },
            { address: '456 Oak Ave, Midtown', eta: '11:15 AM' },
            { address: '789 Pine St, Uptown', eta: '1:45 PM' }
          ]
        },
        {
          id: 2,
          vehicle: 'Van-002',
          distance: 67.6,
          duration: '3h 45m',
          stops: [
            { address: '321 Elm St, Downtown', eta: '10:00 AM' },
            { address: '654 Maple Ave, Midtown', eta: '12:30 PM' }
          ]
        }
      ]
    }
    
    toast.success('Route optimization completed successfully!')
  } catch (error) {
    toast.error('Optimization failed. Please try again.')
  } finally {
    isOptimizing.value = false
  }
}
</script>
