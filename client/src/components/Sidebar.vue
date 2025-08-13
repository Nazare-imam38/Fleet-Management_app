<template>
  <div class="fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-white/90 to-slate-50/90 backdrop-blur-xl shadow-2xl border-r border-white/20">
    <div class="flex flex-col h-full">
      <!-- Logo -->
      <div class="flex items-center justify-center h-20 px-6 border-b border-white/20 bg-gradient-to-r from-blue-600/10 to-purple-600/10">
        <div class="flex items-center space-x-3">
          <div class="h-10 w-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <Truck class="h-6 w-6 text-white" />
          </div>
          <span class="text-xl font-bold gradient-text">Smart Routing</span>
        </div>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 px-4 py-6 space-y-3">
        <router-link
          v-for="item in navigationItems"
          :key="item.name"
          :to="item.href"
          :class="[
            'flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 group',
            $route.path === item.href
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-105'
              : 'text-slate-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-700 hover:shadow-md hover:transform hover:scale-105'
          ]"
        >
          <component :is="item.icon" :class="['h-5 w-5 mr-3 transition-transform duration-300', $route.path === item.href ? 'text-white' : 'text-slate-500 group-hover:text-blue-600 group-hover:scale-110']" />
          {{ item.name }}
        </router-link>
      </nav>

      <!-- User Profile -->
      <div class="p-4 border-t border-gray-200">
        <div class="flex items-center space-x-3">
          <div class="h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center">
            <User class="h-5 w-5 text-primary-600" />
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-900 truncate">
              {{ user?.name || 'User' }}
            </p>
            <p class="text-xs text-gray-500 truncate">
              {{ user?.email || 'user@example.com' }}
            </p>
          </div>
          <button
            @click="handleLogout"
            class="p-1 text-gray-400 hover:text-gray-600 transition-colors"
            title="Logout"
          >
            <LogOut class="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '../stores/app'
import { useToast } from 'vue-toastification'
import {
  LayoutDashboard,
  Map,
  Truck,
  Route,
  BarChart3,
  User,
  LogOut
} from 'lucide-vue-next'

const router = useRouter()
const appStore = useAppStore()

const user = computed(() => appStore.user)
const toast = useToast()

const navigationItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Live Map', href: '/map', icon: Map },
  { name: 'Fleet Management', href: '/fleet', icon: Truck },
  { name: 'Route Optimization', href: '/optimization', icon: Route },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 }
]

const handleLogout = () => {
  appStore.logout()
  toast.success('Successfully logged out')
  router.push('/login')
}
</script>
