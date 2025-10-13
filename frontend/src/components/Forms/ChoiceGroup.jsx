export default function ChoiceGroup({ label, name, options, register, required, error }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: 'block', fontWeight: 600, marginBottom: 8 }}>
        {label}{required ? ' *' : ''}
      </label>
      {options.map(opt => (
        <div key={opt.value} style={{ marginBottom: 6 }}>
          <label>
            <input type="radio" value={opt.value} {...register(name, { required })} /> {opt.label}
          </label>
        </div>
      ))}
      {error && <small style={{ color: 'crimson' }}>Este campo es requerido</small>}
    </div>
  )
}
