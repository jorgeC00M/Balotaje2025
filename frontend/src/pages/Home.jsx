import { useNavigate, Link } from 'react-router-dom'
import '../styles/home.css'

export default function Home() {
  const navigate = useNavigate()

  return (
    <section className="home-hero">
      <div className="home-card">
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
          <div>
            <div className="badge">Proyecto • Balotaje 2025</div>
            <h1 className="home-title">Encuesta y Analítica para 2da Vuelta</h1>
            <p className="home-subtitle">
              Carga tus datos de Google Forms, captura nuevas respuestas y visualiza
              resultados con análisis estadístico (descriptivos, crosstabs y regresión logística).
            </p>

            <div className="home-actions">
              <button
                onClick={() => navigate('/encuesta')}
                className="btn primary"
                aria-label="Ir a la encuesta"
              >
                📝 LLEGAR ENCUESTA 2DA VUELTA 2025
              </button>

              <Link to="/analitica" className="btn" aria-label="Ver panel de analítica">
                📊 Ver Analítica
              </Link>

              <Link to="/importar" className="btn" aria-label="Importar archivo de respuestas">
                ⬆️ Importar Respuestas
              </Link>
            </div>
          </div>

          {/* Logo simple opcional */}
          <div style={{ display: 'none', width: 120, height: 120, flexShrink: 0, borderRadius: 16, background: 'rgba(255,255,255,.18)' }} />
        </div>

        {/* Accesos rápidos */}
        <div className="quick-grid">
          <Link to="/encuesta" className="quick">
            <div>
              <h4>Capturar Respuesta</h4>
              <p>Formulario similar a Google Forms para nuevas entradas.</p>
            </div>
            <span>→</span>
          </Link>

          <Link to="/importar" className="quick">
            <div>
              <h4>Importar Google Forms</h4>
              <p>Sube tu Excel/CSV y actualiza el dataset del análisis.</p>
            </div>
            <span>→</span>
          </Link>

          <Link to="/analitica" className="quick">
            <div>
              <h4>Panel de Gráficos</h4>
              <p>Distribución de voto y coeficientes de la logística.</p>
            </div>
            <span>→</span>
          </Link>
        </div>
      </div>
    </section>
  )
}

