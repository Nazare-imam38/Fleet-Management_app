<template>
  <div class="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
    <Sidebar />
    
    <div class="flex-1 ml-64 flex flex-col">
      <!-- Header -->
      <div class="bg-white border-b border-gray-200 px-6 py-4">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Live Map</h1>
            <p class="text-gray-600">Real-time vehicle tracking and route visualization</p>
          </div>
          <div class="flex items-center space-x-4">
            <div class="flex items-center space-x-2">
              <div class="w-3 h-3 bg-green-500 rounded-full"></div>
              <span class="text-sm text-gray-600">Active</span>
            </div>
            <div class="flex items-center space-x-2">
              <div class="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span class="text-sm text-gray-600">Idle</span>
            </div>
            <div class="flex items-center space-x-2">
              <div class="w-3 h-3 bg-red-500 rounded-full"></div>
              <span class="text-sm text-gray-600">Maintenance</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Map Container -->
      <div class="flex-1 relative">
        <div id="map" class="w-full h-full"></div>
        
        <!-- Map Controls -->
        <div class="absolute top-4 right-4 space-y-2">
          <button
            @click="toggleTraffic"
            :class="`p-2 rounded-lg shadow-lg ${showTraffic ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`"
            title="Toggle Traffic"
          >
            <Car class="h-5 w-5" />
          </button>
          <button
            @click="toggleRoutes"
            :class="`p-2 rounded-lg shadow-lg ${showRoutes ? 'bg-green-600 text-white' : 'bg-white text-gray-700'}`"
            title="Toggle Routes"
          >
            <Route class="h-5 w-5" />
          </button>
          <button
            @click="centerMap"
            class="p-2 rounded-lg shadow-lg bg-white text-gray-700 hover:bg-gray-50"
            title="Center Map"
          >
            <Crosshair class="h-5 w-5" />
          </button>
        </div>

        <!-- Vehicle Info Panel -->
        <div v-if="selectedVehicle" class="absolute bottom-4 left-4 w-80 bg-white rounded-lg shadow-lg border border-gray-200">
          <div class="p-4">
            <div class="flex items-center justify-between mb-3">
              <h3 class="text-lg font-semibold text-gray-900">{{ selectedVehicle.name }}</h3>
              <button @click="selectedVehicle = null" class="text-gray-400 hover:text-gray-600">
                <X class="h-5 w-5" />
              </button>
            </div>
            
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600">Driver:</span>
                <span class="text-sm font-medium text-gray-900">{{ selectedVehicle.driver }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600">Status:</span>
                <span :class="`text-sm font-medium ${getStatusColor(selectedVehicle.status)}`">
                  {{ selectedVehicle.status }}
                </span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600">Speed:</span>
                <span class="text-sm font-medium text-gray-900">{{ selectedVehicle.speed }} km/h</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600">ETA:</span>
                <span class="text-sm font-medium text-gray-900">{{ selectedVehicle.eta }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600">Fuel:</span>
                <span class="text-sm font-medium text-gray-900">{{ selectedVehicle.fuel }}%</span>
              </div>
            </div>
            
            <div class="mt-4 pt-3 border-t border-gray-200">
              <button class="w-full btn-primary text-sm">
                View Details
              </button>
            </div>
          </div>
        </div>

        <!-- Route Info Panel -->
        <div v-if="selectedRoute" class="absolute top-4 left-4 w-80 bg-white rounded-lg shadow-lg border border-gray-200">
          <div class="p-4">
            <div class="flex items-center justify-between mb-3">
              <h3 class="text-lg font-semibold text-gray-900">Route {{ selectedRoute.id }}</h3>
              <button @click="selectedRoute = null" class="text-gray-400 hover:text-gray-600">
                <X class="h-5 w-5" />
              </button>
            </div>
            
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600">Vehicle:</span>
                <span class="text-sm font-medium text-gray-900">{{ selectedRoute.vehicle }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600">Stops:</span>
                <span class="text-sm font-medium text-gray-900">{{ selectedRoute.stops }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600">Distance:</span>
                <span class="text-sm font-medium text-gray-900">{{ selectedRoute.distance }} km</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600">Duration:</span>
                <span class="text-sm font-medium text-gray-900">{{ selectedRoute.duration }}</span>
              </div>
            </div>
            
            <div class="mt-4 pt-3 border-t border-gray-200">
              <button class="w-full btn-secondary text-sm">
                Optimize Route
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import Sidebar from '../components/Sidebar.vue'
import { Car, Route, Crosshair, X } from 'lucide-vue-next'

const showTraffic = ref(false)
const showRoutes = ref(true)
const selectedVehicle = ref(null)
const selectedRoute = ref(null)
let map = null

const vehicles = ref([
  {
    id: 1,
    name: 'Truck-001',
    driver: 'John Smith',
    status: 'active',
    speed: 45,
    eta: '15 min',
    fuel: 78,
    position: [40.7128, -74.0060]
  },
  {
    id: 2,
    name: 'Van-002',
    driver: 'Sarah Johnson',
    status: 'idle',
    speed: 0,
    eta: 'N/A',
    fuel: 92,
    position: [40.7589, -73.9851]
  },
  {
    id: 3,
    name: 'Truck-003',
    driver: 'Mike Wilson',
    status: 'active',
    speed: 38,
    eta: '32 min',
    fuel: 65,
    position: [40.7505, -73.9934]
  }
])

const routes = ref([
  {
    id: 'R001',
    vehicle: 'Truck-001',
    stops: 8,
    distance: 45.2,
    duration: '2h 15m',
    coordinates: [
      [40.7128, -74.0060],
      [40.7589, -73.9851],
      [40.7505, -73.9934],
      [40.7484, -73.9857],
      [40.7549, -73.9840]
    ]
  }
])

const getStatusColor = (status) => {
  const colors = {
    active: 'text-green-600',
    idle: 'text-yellow-600',
    maintenance: 'text-red-600'
  }
  return colors[status] || 'text-gray-600'
}

const toggleTraffic = () => {
  showTraffic.value = !showTraffic.value
  // Implementation for traffic layer toggle
}

const toggleRoutes = () => {
  showRoutes.value = !showRoutes.value
  // Implementation for route layer toggle
}

const centerMap = () => {
  if (map) {
    map.setView([40.7128, -74.0060], 12)
  }
}

const initMap = () => {
  // Initialize Leaflet map
  map = L.map('map').setView([40.7128, -74.0060], 12)
  
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map)

  // Add vehicle markers
  vehicles.value.forEach(vehicle => {
    const marker = L.marker(vehicle.position)
      .bindPopup(`
        <div class="p-2">
          <h3 class="font-semibold">${vehicle.name}</h3>
          <p class="text-sm">${vehicle.driver}</p>
          <p class="text-sm">Status: ${vehicle.status}</p>
        </div>
      `)
      .addTo(map)
    
    marker.on('click', () => {
      selectedVehicle.value = vehicle
    })
  })

  // Add route polylines
  routes.value.forEach(route => {
    const polyline = L.polyline(route.coordinates, {
      color: '#3b82f6',
      weight: 4,
      opacity: 0.8
    }).addTo(map)
    
    polyline.on('click', () => {
      selectedRoute.value = route
    })
  })
}

onMounted(() => {
  // Load Leaflet dynamically
  const script = document.createElement('script')
  script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
  script.onload = () => {
    initMap()
  }
  document.head.appendChild(script)
})

onUnmounted(() => {
  if (map) {
    map.remove()
  }
})
</script>
