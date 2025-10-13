import { Outlet, Link } from 'react-router-dom'

export default function App() {
  return (
    <>
      <nav style={{ padding: '12px 16px', borderBottom: '1px solid #e5e7eb' }}>
        <Link to="/" style={{ marginRight: 12 }}>Home</Link>
        <Link to="/encuesta" style={{ marginRight: 12 }}>Encuesta</Link>
        <Link to="/importar" style={{ marginRight: 12 }}>Importar</Link>
        <Link to="/analitica">Analítica</Link>
      </nav>
      <div style={{ padding: 24 }}>
        <Outlet />
      </div>
    </>
  )
}
