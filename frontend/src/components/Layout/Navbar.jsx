import { Link, NavLink } from 'react-router-dom'

const navStyle = ({ isActive }) => ({
  fontWeight: isActive ? '600' : '400',
  textDecoration: 'none',
  marginLeft: '1rem'
})

export default function Navbar() {
  return (
    <nav style={{ padding: '1rem', borderBottom: '1px solid #eee' }}>
      <Link to="/" style={{ fontWeight: 700, textDecoration: 'none' }}>
        Balotaje 2025
      </Link>
      <span style={{ marginLeft: '2rem' }}>
        <NavLink to="/" style={navStyle}>Home</NavLink>
        <NavLink to="/encuesta" style={navStyle}>Encuesta</NavLink>
        <NavLink to="/importar" style={navStyle}>Importar</NavLink>
        <NavLink to="/analitica" style={navStyle}>Analítica</NavLink>
      </span>
    </nav>
  )
}
