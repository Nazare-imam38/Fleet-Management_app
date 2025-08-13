<template>
  <div class="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
    <Sidebar />
    
    <div class="flex-1 ml-64 overflow-auto">
      <div class="p-8">
        <!-- Header -->
        <div class="flex items-center justify-between mb-8">
          <div>
            <h1 class="text-4xl font-bold gradient-text mb-3">Fleet Management</h1>
            <p class="text-slate-600 text-lg">Manage your vehicle fleet and driver assignments</p>
          </div>
          <button @click="showAddVehicle = true" class="btn-primary flex items-center">
            <Plus class="h-4 w-4 mr-2" />
            Add Vehicle
          </button>
        </div>

        <!-- Stats Overview -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div class="card">
            <div class="flex items-center">
              <div class="p-3 bg-green-100 rounded-lg">
                <Truck class="h-6 w-6 text-green-600" />
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">Total Vehicles</p>
                <p class="text-2xl font-bold text-gray-900">{{ fleetStats.total }}</p>
              </div>
            </div>
          </div>

          <div class="card">
            <div class="flex items-center">
              <div class="p-3 bg-blue-100 rounded-lg">
                <User class="h-6 w-6 text-blue-600" />
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">Active Drivers</p>
                <p class="text-2xl font-bold text-gray-900">{{ fleetStats.activeDrivers }}</p>
              </div>
            </div>
          </div>

          <div class="card">
            <div class="flex items-center">
              <div class="p-3 bg-yellow-100 rounded-lg">
                <Wrench class="h-6 w-6 text-yellow-600" />
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">Maintenance Due</p>
                <p class="text-2xl font-bold text-gray-900">{{ fleetStats.maintenanceDue }}</p>
              </div>
            </div>
          </div>

          <div class="card">
            <div class="flex items-center">
              <div class="p-3 bg-purple-100 rounded-lg">
                <Fuel class="h-6 w-6 text-purple-600" />
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">Avg Fuel Level</p>
                <p class="text-2xl font-bold text-gray-900">{{ fleetStats.avgFuel }}%</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Vehicle List -->
        <div class="card">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-semibold text-gray-900">Vehicle Fleet</h2>
            <div class="flex items-center space-x-4">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search vehicles..."
                class="input-field w-64"
              />
              <select v-model="statusFilter" class="input-field w-40">
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="idle">Idle</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="border-b border-gray-200">
                  <th class="text-left py-3 px-4 font-medium text-gray-900">Vehicle</th>
                  <th class="text-left py-3 px-4 font-medium text-gray-900">Driver</th>
                  <th class="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                  <th class="text-left py-3 px-4 font-medium text-gray-900">Location</th>
                  <th class="text-left py-3 px-4 font-medium text-gray-900">Fuel</th>
                  <th class="text-left py-3 px-4 font-medium text-gray-900">Last Service</th>
                  <th class="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="vehicle in filteredVehicles" :key="vehicle.id" class="border-b border-gray-100 hover:bg-gray-50">
                  <td class="py-4 px-4">
                    <div class="flex items-center">
                      <div class="h-10 w-10 bg-primary-100 rounded-lg flex items-center justify-center mr-3">
                        <Truck class="h-5 w-5 text-primary-600" />
                      </div>
                      <div>
                        <p class="font-medium text-gray-900">{{ vehicle.name }}</p>
                        <p class="text-sm text-gray-500">{{ vehicle.type }}</p>
                      </div>
                    </div>
                  </td>
                  <td class="py-4 px-4">
                    <div class="flex items-center">
                      <div class="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center mr-2">
                        <User class="h-4 w-4 text-gray-600" />
                      </div>
                      <span class="text-sm font-medium text-gray-900">{{ vehicle.driver }}</span>
                    </div>
                  </td>
                  <td class="py-4 px-4">
                    <span :class="`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(vehicle.status)}`">
                      {{ vehicle.status }}
                    </span>
                  </td>
                  <td class="py-4 px-4 text-sm text-gray-900">{{ vehicle.location }}</td>
                  <td class="py-4 px-4">
                    <div class="flex items-center">
                      <div class="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div :class="`h-2 rounded-full ${getFuelColor(vehicle.fuel)}`" :style="{ width: vehicle.fuel + '%' }"></div>
                      </div>
                      <span class="text-sm text-gray-900">{{ vehicle.fuel }}%</span>
                    </div>
                  </td>
                  <td class="py-4 px-4 text-sm text-gray-900">{{ vehicle.lastService }}</td>
                  <td class="py-4 px-4">
                    <div class="flex items-center space-x-2">
                      <button @click="editVehicle(vehicle)" class="text-blue-600 hover:text-blue-800">
                        <Edit class="h-4 w-4" />
                      </button>
                      <button @click="viewDetails(vehicle)" class="text-gray-600 hover:text-gray-800">
                        <Eye class="h-4 w-4" />
                      </button>
                      <button @click="deleteVehicle(vehicle.id)" class="text-red-600 hover:text-red-800">
                        <Trash2 class="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Vehicle Modal -->
    <div v-if="showAddVehicle" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Add New Vehicle</h3>
        <form @submit.prevent="addVehicle" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Vehicle Name</label>
            <input v-model="newVehicle.name" type="text" class="input-field" required />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select v-model="newVehicle.type" class="input-field" required>
              <option value="">Select Type</option>
              <option value="Truck">Truck</option>
              <option value="Van">Van</option>
              <option value="Car">Car</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Driver</label>
            <input v-model="newVehicle.driver" type="text" class="input-field" required />
          </div>
          <div class="flex space-x-3">
            <button type="button" @click="showAddVehicle = false" class="flex-1 btn-secondary">
              Cancel
            </button>
            <button type="submit" class="flex-1 btn-primary">
              Add Vehicle
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
  Truck,
  User,
  Wrench,
  Fuel,
  Edit,
  Eye,
  Trash2
} from 'lucide-vue-next'

const showAddVehicle = ref(false)
const searchQuery = ref('')
const statusFilter = ref('')
const toast = useToast()

const fleetStats = ref({
  total: 15,
  activeDrivers: 12,
  maintenanceDue: 3,
  avgFuel: 78
})

const vehicles = ref([
  {
    id: 1,
    name: 'Truck-001',
    type: 'Truck',
    driver: 'John Smith',
    status: 'active',
    location: 'Downtown',
    fuel: 78,
    lastService: '2024-01-15'
  },
  {
    id: 2,
    name: 'Van-002',
    type: 'Van',
    driver: 'Sarah Johnson',
    status: 'idle',
    location: 'Warehouse',
    fuel: 92,
    lastService: '2024-01-10'
  },
  {
    id: 3,
    name: 'Truck-003',
    type: 'Truck',
    driver: 'Mike Wilson',
    status: 'maintenance',
    location: 'Service Center',
    fuel: 45,
    lastService: '2024-01-20'
  }
])

const newVehicle = ref({
  name: '',
  type: '',
  driver: ''
})

const filteredVehicles = computed(() => {
  return vehicles.value.filter(vehicle => {
    const matchesSearch = vehicle.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                         vehicle.driver.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesStatus = !statusFilter.value || vehicle.status === statusFilter.value
    return matchesSearch && matchesStatus
  })
})

const getStatusBadgeClass = (status) => {
  const classes = {
    active: 'bg-green-100 text-green-800',
    idle: 'bg-yellow-100 text-yellow-800',
    maintenance: 'bg-red-100 text-red-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const getFuelColor = (fuel) => {
  if (fuel < 25) return 'bg-red-500'
  if (fuel < 50) return 'bg-yellow-500'
  return 'bg-green-500'
}

const addVehicle = () => {
  const vehicle = {
    id: Date.now(),
    ...newVehicle.value,
    status: 'idle',
    location: 'Warehouse',
    fuel: 100,
    lastService: new Date().toISOString().split('T')[0]
  }
  
  vehicles.value.push(vehicle)
  showAddVehicle.value = false
  newVehicle.value = { name: '', type: '', driver: '' }
  toast.success('Vehicle added successfully')
}

const editVehicle = (vehicle) => {
  // Implementation for editing vehicle
  toast.info('Edit functionality coming soon')
}

const viewDetails = (vehicle) => {
  // Implementation for viewing vehicle details
  toast.info('View details functionality coming soon')
}

const deleteVehicle = (id) => {
  if (confirm('Are you sure you want to delete this vehicle?')) {
    vehicles.value = vehicles.value.filter(v => v.id !== id)
    toast.success('Vehicle deleted successfully')
  }
}
</script>
