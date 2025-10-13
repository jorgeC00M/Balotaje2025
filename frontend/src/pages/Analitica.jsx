import { useEffect, useState } from 'react'
import { getSummary } from '../services/api'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'

function toChartData(obj) {
  // { labels: [...], values: [...] } -> [{name, value}, ...]
  if (!obj || !obj.labels) return []
  return obj.labels.map((name, i) => ({ name, value: obj.values[i] }))
}

export default function Analitica() {
  const [sum, setSum] = useState(null)
  const [err, setErr] = useState('')

  useEffect(() => {
    getSummary()
      .then(setSum)
      .catch(e => setErr(e.response?.data || e.message))
  }, [])

  if (err) return <div style={{padding:24}}>Error: {err}</div>
  if (!sum) return <div style={{padding:24}}>Cargando…</div>

  return (
    <div style={{padding:24}}>
      <h2>Analítica</h2>
      <p>Total de respuestas: <b>{sum.total}</b></p>

      <h3>Edad</h3>
      <Chart data={toChartData(sum.edad)} />

      <h3>Género</h3>
      <Chart data={toChartData(sum.genero)} />

      <h3>Departamento</h3>
      <Chart data={toChartData(sum.departamento)} />
    </div>
  )
}

function Chart({ data }) {
  if (!data.length) return <p>Sin datos</p>
  return (
    <div style={{ width: '100%', height: 300, marginBottom: 24 }}>
      <ResponsiveContainer>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" interval={0} angle={-10} textAnchor="end" height={70} />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="value" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

