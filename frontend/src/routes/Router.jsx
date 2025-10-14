import { createBrowserRouter } from 'react-router-dom'
import App from '../App'
import Home from '../pages/Home'
import ImportarRespuestas from '../pages/ImportarRespuestas'
import Encuesta from '../pages/Encuesta'
import Analitica from '../pages/Analitica'  // 👈 Importar el componente real

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: 'encuesta', element: <Encuesta /> },
      { path: 'importar', element: <ImportarRespuestas /> },
      { path: 'analitica', element: <Analitica /> },  // 👈 Ya no es placeholder
    ],
  },
])

export default router