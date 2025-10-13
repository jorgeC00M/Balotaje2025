import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { postRespuesta } from '../services/api'
import LikertGroup from '../components/Forms/LikertGroup'
import ChoiceGroup from '../components/Forms/ChoiceGroup'

export default function Encuesta() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm()
  const [status, setStatus] = useState('')

  const onSubmit = async (values) => {
    try {
      setStatus('Enviando...')
      await postRespuesta(values) // requiere endpoint en backend
      setStatus('Respuesta registrada. ¡Gracias!')
      reset()
    } catch (e) {
      setStatus(`Error: ${e?.response?.data?.error || e.message}`)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ maxWidth: 720 }}>
      <h2>Encuesta 2da Vuelta 2025</h2>

      <ChoiceGroup
        label="Intención de voto"
        name="voto"
        options={[
          { label: 'Rodrigo Paz Pereira (Izquierda)', value: 'Rodrigo Paz' },
          { label: 'Jorge Quiroga Ramírez (Derecha)', value: 'Jorge Quiroga' },
          { label: 'Blanco', value: 'Blanco' },
          { label: 'Nulo', value: 'Nulo' },
          { label: 'Indeciso', value: 'Indeciso' },
        ]}
        register={register}
        required
        error={errors.voto}
      />

      <LikertGroup
        label="Importancia: Economía - Empleo"
        name="economia_empleo"
        register={register}
        required
        error={errors.economia_empleo}
      />

      {/* Agrega aquí el resto de tus preguntas (demográficas, factores, percepciones, etc.) */}

      <button type="submit" style={{ marginTop: 16 }}>Enviar</button>
      <p style={{ marginTop: 8 }}>{status}</p>
    </form>
  )
}
