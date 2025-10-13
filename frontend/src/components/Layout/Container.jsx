export default function Container({ children }) {
  return (
    <div style={{ maxWidth: 1080, margin: '0 auto', padding: '1.5rem' }}>
      {children}
    </div>
  )
}
