import { Bar } from 'react-chartjs-2'
import { Chart, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js'
Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend)

export default function LogisticBars({ coeficientes }) {
  const labels = Object.keys(coeficientes || {})
  const values = Object.values(coeficientes || {})

  const data = {
    labels,
    datasets: [{ label: 'Coeficiente', data: values }]
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: { y: { beginAtZero: true } }
  }

  return (
    <div style={{ height: 320 }}>
      <Bar data={data} options={options} />
    </div>
  )
}
