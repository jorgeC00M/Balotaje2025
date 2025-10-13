import { useQuery } from '@tanstack/react-query'
import { getAnalisis } from '../services/api'
import VotePie from '../components/Charts/VotePie'
import LogisticBars from '../components/Charts/LogisticBars'

export default function Analitica() {
  const { data, isLoading, error } = useQuery({ queryKey: ['analisis'], queryFn: getAnalisis })

  if (isLoading) return <p>Cargando análisis...</p>
  if (error) return <p>Error: {error.message}</p>
  if (data?.error) return <p>Backend: {data.error}</p>

  const conteo = data?.conteo || {}
  const coef = data?.coeficientes || {}

  return (
    <div>
      <h2>Analítica</h2>

      <section>
        <h3>Distribución de voto</h3>
        <VotePie conteo={conteo} />
      </section>

      <section>
        <h3>Coeficientes (Regresión Logística)</h3>
        <LogisticBars coeficientes={coef} />
      </section>
    </div>
  )
}
