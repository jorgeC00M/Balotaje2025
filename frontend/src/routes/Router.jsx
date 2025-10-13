import { createBrowserRouter } from 'react-router-dom'
import App from '../App'

// Estas dos páginas sí me confirmaste que existen:
import Home from '../pages/Home'
import ImportarRespuestas from '../pages/ImportarRespuestas'

// Placeholders temporales por si no existen aún:
function Encuesta() {
  return <div style={{padding:24}}>Encuesta (placeholder)</div>
}
function Analitica() {
  return <div style={{padding:24}}>Analítica (placeholder)</div>
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: 'encuesta', element: <Encuesta /> },             // <- placeholder
      { path: 'importar', element: <ImportarRespuestas /> },
      { path: 'analitica', element: <Analitica /> },           // <- placeholder
    ],
  },
])

export default router

