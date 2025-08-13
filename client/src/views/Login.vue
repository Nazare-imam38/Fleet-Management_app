<template>
  <div class="min-h-screen flex items-center justify-center animated-bg relative overflow-hidden">
    <!-- Animated background elements -->
    <div class="absolute inset-0 overflow-hidden">
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/30 to-purple-600/30 rounded-full blur-3xl animate-pulse"></div>
      <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-pink-400/30 to-orange-600/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-cyan-400/20 to-blue-600/20 rounded-full blur-3xl animate-pulse delay-500"></div>
    </div>
    
    <div class="max-w-md w-full space-y-8 p-8 relative z-10">
      <div class="text-center">
        <div class="mx-auto h-20 w-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-2xl transform hover:scale-110 transition-transform duration-300">
          <Truck class="h-10 w-10 text-white" />
        </div>
        <h2 class="text-4xl font-bold gradient-text mb-2">Smart Routing</h2>
        <p class="text-slate-600 text-lg">Logistics Optimization Platform</p>
      </div>
      
      <div class="glass-card p-8">
        <form @submit.prevent="handleLogin" class="space-y-6">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              id="email"
              v-model="email"
              type="email"
              required
              class="input-field"
              placeholder="Enter your email"
            />
          </div>
          
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              id="password"
              v-model="password"
              type="password"
              required
              class="input-field"
              placeholder="Enter your password"
            />
          </div>
          
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input
                id="remember-me"
                v-model="rememberMe"
                type="checkbox"
                class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label for="remember-me" class="ml-2 block text-sm text-gray-700">
                Remember me
              </label>
            </div>
          </div>
          
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full btn-primary flex items-center justify-center"
          >
            <Loader v-if="isLoading" class="animate-spin h-4 w-4 mr-2" />
            {{ isLoading ? 'Signing in...' : 'Sign in' }}
          </button>
        </form>
        
        <div class="mt-6 text-center">
          <p class="text-sm text-gray-600">
            Demo credentials: admin@smartrouting.com / password123
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '../stores/app'
import { useToast } from 'vue-toastification'
import { Truck, Loader } from 'lucide-vue-next'

const router = useRouter()
const appStore = useAppStore()
const toast = useToast()

const email = ref('admin@smartrouting.com')
const password = ref('password123')
const rememberMe = ref(false)
const isLoading = ref(false)

const handleLogin = async () => {
  isLoading.value = true
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Mock authentication
    if (email.value === 'admin@smartrouting.com' && password.value === 'password123') {
      const userData = {
        id: 1,
        name: 'Admin User',
        email: email.value,
        role: 'admin'
      }
      
      appStore.setUser(userData)
      localStorage.setItem('token', 'mock-jwt-token')
      
      toast.success('Successfully logged in!')
      router.push('/dashboard')
    } else {
      toast.error('Invalid credentials')
    }
  } catch (error) {
    toast.error('Login failed. Please try again.')
  } finally {
    isLoading.value = false
  }
}
</script>
