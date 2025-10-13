import { Outlet } from 'react-router-dom'
import Navbar from './components/Layout/Navbar'
import Container from './components/Layout/Container'

export default function App() {
  return (
    <>
      <Navbar />
      <Container>
        <Outlet />
      </Container>
    </>
  )
}
