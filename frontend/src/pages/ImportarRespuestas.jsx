import { useState } from 'react'
import { uploadFile } from '../services/api'

export default function ImportarRespuestas() {
  const [file, setFile] = useState(null)
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)

  const onUpload = async () => {
    if (!file) return setMsg('Selecciona un archivo .xlsx o .csv')
    setLoading(true)
    setMsg('')
    try {
      const res = await uploadFile(file)
      setMsg(`✅ Importado: ${res.total} filas.`)
    } catch (e) {
      setMsg(`❌ Error: ${e.response?.data || e.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: 24 }}>
      <h2>Importar respuestas (Excel/CSV de Google Forms)</h2>
      <input type="file" accept=".xlsx,.csv" onChange={(e)=>setFile(e.target.files?.[0]||null)} />
      <button onClick={onUpload} disabled={loading} style={{ marginLeft: 8 }}>
        {loading ? 'Subiendo...' : 'Subir'}
      </button>
      <p style={{ marginTop: 12 }}>{msg}</p>
    </div>
  )
}

