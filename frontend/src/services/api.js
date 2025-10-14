import axios from 'axios'

const API = axios.create({
  baseURL: 'http://localhost:8000/api',
})

export async function uploadFile(file) {
  const fd = new FormData()
  fd.append('file', file)
  const { data } = await API.post('/import', fd, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

export async function getSummary() {
  const { data } = await API.get('/summary')
  return data
}

export async function postRespuesta(payload) {
  const { data } = await API.post('/survey/append', payload)
  return data
}