<template>
  <div id="app" class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
    <!-- Floating particles background -->
    <div class="floating-particles">
      <div v-for="i in 20" :key="i" 
           class="particle"
           :style="{
             left: Math.random() * 100 + '%',
             top: Math.random() * 100 + '%',
             width: Math.random() * 4 + 2 + 'px',
             height: Math.random() * 4 + 2 + 'px',
             animationDelay: Math.random() * 6 + 's',
             animationDuration: (Math.random() * 3 + 4) + 's'
           }">
      </div>
    </div>
    <router-view />
  </div>
</template>

<script setup>
// Toast notifications are handled globally in main.js
</script>
