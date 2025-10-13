const SCALE = [1, 2, 3, 4, 5]

export default function LikertGroup({ label, name, register, required, error }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: 'block', fontWeight: 600, marginBottom: 8 }}>
        {label}{required ? ' *' : ''}
      </label>
      <div style={{ display: 'flex', gap: 12 }}>
        {SCALE.map(v => (
          <label key={v}>
            <input type="radio" value={v} {...register(name, { required })} /> {v}
          </label>
        ))}
      </div>
      {error && <small style={{ color: 'crimson' }}>Selecciona un valor (1–5)</small>}
    </div>
  )
}
