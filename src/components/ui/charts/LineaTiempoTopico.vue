<script setup>
import { ref, watch, onMounted } from 'vue';
import { Line } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement
} from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement);

const props = defineProps({
  topico: {
    type: String,
    required: true
  }
});

const data = ref({
  labels: [],
  datasets: [{
    label: 'Menciones por día',
    data: [],
    fill: false,
    borderColor: '#be985d',
    tension: 0.4,
    pointBackgroundColor: '#be985d'
  }]
});

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      callbacks: {
        label: context => `${context.parsed.y} mencione(s)`
      }
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        precision: 0
      }
    }
  }
};

const cargarDatos = async () => {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/noticias/frecuencia-topico?topico=${encodeURIComponent(props.topico)}`);
    const json = await res.json();

    if (json.success && Array.isArray(json.data)) {
        data.value.labels = json.data.map(d => new Date(d.fecha).toLocaleDateString('es-ES', {
            day: '2-digit', month: '2-digit'
        }));
      data.value.datasets[0].data = json.data.map(d => d.frecuencia);
    }
  } catch (err) {
    console.error('Error al cargar datos del tópico:', err);
  }
};

onMounted(cargarDatos);
watch(() => props.topico, cargarDatos); 
</script>

<template>
    <div class="w-full h-64">
      <Line :key="topico + data.labels.join(',')" :data="data" :options="options" />
    </div>
</template>