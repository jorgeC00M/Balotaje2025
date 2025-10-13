/*import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE,
  withCredentials: false,
})

export const getAnalisis = async () => {
  const { data } = await api.get('/api/analisis/')
  return data
}

export const uploadFile = async (file) => {
  const formData = new FormData()
  formData.append('file', file)
  const { data } = await api.post('/api/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

export const postRespuesta = async (payload) => {
  const { data } = await api.post('/api/response', payload)
  return data
}

export default api*/
import axios from 'axios'

const API = axios.create({
  baseURL: '/api', // <-- SIN http://localhost:8000
})

export async function uploadFile(file) {
  const fd = new FormData()
  fd.append('file', file)
  const { data } = await API.post('/import', fd, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

export async function appendSurveyRow(payload) {
  const { data } = await API.post('/survey/append', payload)
  return data
}

export async function getSummary() {
  const { data } = await API.get('/summary')
  return data
}
