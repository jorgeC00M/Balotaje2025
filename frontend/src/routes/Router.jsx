import { createBrowserRouter } from 'react-router-dom'
import App from '../App'
import Home from '../pages/Home'
import Encuesta from '../pages/Encuesta'
import Importar from '../pages/Importar'
import Analitica from '../pages/Analitica'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: 'encuesta', element: <Encuesta /> },
      { path: 'importar', element: <Importar /> },
      { path: 'analitica', element: <Analitica /> },
    ],
  },
])

export default router
