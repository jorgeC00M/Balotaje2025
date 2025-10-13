import { useState } from 'react'
import { uploadFile } from '../services/api'

export default function Importar() {
  const [file, setFile] = useState(null)
  const [status, setStatus] = useState('')

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!file) return
    try {
      setStatus('Subiendo...')
      const res = await uploadFile(file) // necesita endpoint en backend
      setStatus(`Ok: ${JSON.stringify(res)}`)
    } catch (err) {
      setStatus(`Error: ${err?.response?.data?.error || err.message}`)
    }
  }

  return (
    <div>
      <h2>Importar respuestas (Excel/CSV de Google Forms)</h2>
      <form onSubmit={onSubmit}>
        <input type="file" accept=".xlsx,.csv" onChange={e => setFile(e.target.files[0])} />
        <button type="submit" style={{ marginLeft: 12 }}>Subir</button>
      </form>
      <p style={{ marginTop: 8 }}>{status}</p>
    </div>
  )
}
