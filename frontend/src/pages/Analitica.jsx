import { useEffect, useState } from 'react'
import { getSummary } from '../services/api'
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#ff7c7c']

function toChartData(obj) {
  if (!obj || !obj.labels || obj.labels.length === 0) return []
  return obj.labels.map((name, i) => ({ 
    name: String(name), 
    value: obj.values[i] 
  }))
}

export default function Analitica() {
  const [data, setData] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getSummary()
      .then(res => {
        setData(res)
        setLoading(false)
      })
      .catch(e => {
        setError(e.response?.data?.error || e.message)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div style={{ padding: 40, textAlign: 'center' }}>
        <p>Cargando datos...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ padding: 40, textAlign: 'center' }}>
        <h3 style={{ color: '#ef4444' }}>⚠️ Error</h3>
        <p>{error}</p>
        <p style={{ marginTop: 20, color: '#6b7280' }}>
          Asegúrate de haber subido un archivo Excel en la sección "Importar"
        </p>
      </div>
    )
  }

  if (!data || data.total === 0) {
    return (
      <div style={{ padding: 40, textAlign: 'center' }}>
        <h3>📊 Sin datos</h3>
        <p>No hay respuestas para analizar. Sube un archivo Excel primero.</p>
      </div>
    )
  }

  // Filtrar solo las columnas que tienen datos de gráficos
  const chartableColumns = Object.keys(data).filter(key => 
    key !== 'total' && 
    key !== 'columnas_disponibles' && 
    key !== 'error' &&
    data[key]?.labels?.length > 0
  )

  return (
    <div style={{ padding: 24, maxWidth: 1400, margin: '0 auto' }}>
      <header style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: '2rem', marginBottom: 8 }}>📊 Análisis de Resultados</h1>
        <p style={{ color: '#6b7280', fontSize: '1.1rem' }}>
          Total de respuestas: <strong style={{ color: '#059669' }}>{data.total}</strong>
        </p>
        {data.columnas_disponibles && (
          <details style={{ marginTop: 12, color: '#6b7280', fontSize: '.9rem' }}>
            <summary style={{ cursor: 'pointer' }}>
              Ver columnas del archivo ({data.columnas_disponibles.length})
            </summary>
            <ul style={{ marginTop: 8, paddingLeft: 20 }}>
              {data.columnas_disponibles.map(col => (
                <li key={col}>{col}</li>
              ))}
            </ul>
          </details>
        )}
      </header>

      <div style={{ display: 'grid', gap: 32 }}>
        {chartableColumns.map((colName, idx) => {
          const chartData = toChartData(data[colName])
          if (chartData.length === 0) return null

          // Decidir tipo de gráfico según cantidad de categorías
          const usePie = chartData.length <= 6
          
          return (
            <section key={colName} style={{
              background: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: 12,
              padding: 24,
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ 
                fontSize: '1.25rem', 
                marginBottom: 16,
                color: '#111827',
                textTransform: 'capitalize'
              }}>
                {formatColumnName(colName)}
              </h3>
              
              {usePie ? (
                <PieChartComponent data={chartData} />
              ) : (
                <BarChartComponent data={chartData} />
              )}
              
              {/* Tabla de resumen */}
              <SummaryTable data={chartData} total={data.total} />
            </section>
          )
        })}
      </div>
    </div>
  )
}

// Componente de gráfico de torta
function PieChartComponent({ data }) {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={100}
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}

// Componente de gráfico de barras
function BarChartComponent({ data }) {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="name" 
          angle={-25} 
          textAnchor="end" 
          height={100}
          interval={0}
          style={{ fontSize: '0.85rem' }}
        />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Bar dataKey="value" fill="#3b82f6" />
      </BarChart>
    </ResponsiveContainer>
  )
}

// Tabla de resumen con porcentajes
function SummaryTable({ data, total }) {
  return (
    <div style={{ marginTop: 20, overflowX: 'auto' }}>
      <table style={{ 
        width: '100%', 
        borderCollapse: 'collapse',
        fontSize: '0.9rem'
      }}>
        <thead>
          <tr style={{ background: '#f3f4f6', borderBottom: '2px solid #d1d5db' }}>
            <th style={{ padding: 10, textAlign: 'left' }}>Opción</th>
            <th style={{ padding: 10, textAlign: 'right' }}>Respuestas</th>
            <th style={{ padding: 10, textAlign: 'right' }}>Porcentaje</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, idx) => (
            <tr key={idx} style={{ borderBottom: '1px solid #e5e7eb' }}>
              <td style={{ padding: 10 }}>{item.name}</td>
              <td style={{ padding: 10, textAlign: 'right', fontWeight: 600 }}>
                {item.value}
              </td>
              <td style={{ padding: 10, textAlign: 'right', color: '#6b7280' }}>
                {((item.value / total) * 100).toFixed(1)}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// Función auxiliar para formatear nombres de columnas
function formatColumnName(str) {
  return str
    .replace(/_/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase())
}