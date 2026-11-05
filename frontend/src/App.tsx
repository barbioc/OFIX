import { useEffect, useState } from 'react'
import Landing from './Landing'
import Login from './Login'
import Register from './Register'
import ClientApp from './ClientApp'
import ProDashboard from './ProDashboard'

export default function App() {
  const [hash, setHash] = useState(window.location.hash)
  useEffect(() => {
    const on = () => {
      setHash(window.location.hash)
      if (window.location.hash.startsWith('#/')) window.scrollTo(0, 0)
    }
    window.addEventListener('hashchange', on)
    return () => window.removeEventListener('hashchange', on)
  }, [])
  if (hash === '#/cliente') return <ClientApp />
  if (hash === '#/cliente/profesionales') return <ClientApp catalog />
  if (hash === '#/profesional') return <ProDashboard />
  if (hash === '#/registro') return <Register />
  return hash === '#/login' ? <Login /> : <Landing />
}
