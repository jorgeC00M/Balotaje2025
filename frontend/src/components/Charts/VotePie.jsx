import { Pie } from 'react-chartjs-2'
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js'
Chart.register(ArcElement, Tooltip, Legend)

export default function VotePie({ conteo }) {
  const labels = Object.keys(conteo || {})
  const values = Object.values(conteo || {})

  const data = { labels, datasets: [{ data: values }] }
  const options = { responsive: true, maintainAspectRatio: false }

  return (
    <div style={{ height: 300 }}>
      <Pie data={data} options={options} />
    </div>
  )
}
