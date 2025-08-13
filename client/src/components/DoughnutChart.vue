<template>
  <div class="relative">
    <canvas ref="chartRef"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

const props = defineProps({
  data: {
    type: Object,
    required: true
  }
})

const chartRef = ref(null)
let chart = null

const createChart = () => {
  if (chart) {
    chart.destroy()
  }

  const ctx = chartRef.value.getContext('2d')
  
  chart = new Chart(ctx, {
    type: 'doughnut',
    data: props.data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            usePointStyle: true,
            padding: 20,
            font: {
              family: 'Inter',
              size: 12
            }
          }
        }
      },
      cutout: '60%'
    }
  })
}

onMounted(() => {
  createChart()
})

watch(() => props.data, () => {
  createChart()
}, { deep: true })
</script>
