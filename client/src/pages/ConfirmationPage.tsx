import { useNavigate } from 'react-router-dom'

const ConfirmationPage = () => {
  const navigate = useNavigate()
  
  const handleNewPurchase = () => {
    navigate('/cart')
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F0F1F9', fontFamily: 'Be Vietnam Pro, sans-serif' }}>
      <header style={{ 
        padding: '1rem 2rem', 
        background: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
      }}>
        <span 
          style={{ 
            fontSize: '1.5rem', 
            fontWeight: '800',
            fontFamily: 'Plus Jakarta Sans, sans-serif',
            color: '#2563EB',
          }}>
          VIBRA SHOP
        </span>
        <nav style={{ display: 'flex', gap: '2rem', color: '#1A1A2E' }}>
          <span style={{ cursor: 'pointer', fontWeight: '500', fontSize: '0.9rem' }}>Hombre</span>
          <span style={{ cursor: 'pointer', fontWeight: '500', fontSize: '0.9rem' }}>Mujer</span>
          <span style={{ cursor: 'pointer', fontWeight: '500', fontSize: '0.9rem' }}>Accesorios</span>
          <span style={{ cursor: 'pointer', fontWeight: '500', fontSize: '0.9rem', color: '#FF2E63' }}>Ofertas</span>
        </nav>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <span style={{ color: '#1A1A2E', cursor: 'pointer', fontSize: '1.25rem' }}>👤</span>
          <span style={{ color: '#1A1A2E', cursor: 'pointer', fontSize: '1.25rem' }}>🛒</span>
        </div>
      </header>

      <main style={{ padding: '3rem 2rem', maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
        <div style={{
          background: '#fff',
          borderRadius: '14px',
          border: '1px solid #E2E4F0',
          padding: '3rem 2rem',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: '#10B981',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
            fontSize: '2.5rem',
            color: '#fff',
          }}>
            ✓
          </div>

          <h1 style={{ 
            color: '#1A1A2E', 
            fontFamily: 'Plus Jakarta Sans, sans-serif',
            fontSize: '1.75rem',
            fontWeight: '800',
            margin: '0 0 1rem',
          }}>
            ¡Compra Realizada con Éxito!
          </h1>

          <p style={{ color: '#71749E', fontSize: '1rem', margin: '0 0 2rem', lineHeight: '1.6' }}>
            Tu pedido ha sido confirmado y será procesado pronto. 
            Recibirás un correo electrónico con los detalles de tu compra.
          </p>

          <div style={{
            background: '#F0F1F9',
            borderRadius: '12px',
            padding: '1.25rem',
            marginBottom: '2rem',
          }}>
            <p style={{ margin: 0, color: '#71749E', fontSize: '0.85rem', textTransform: 'uppercase', fontWeight: '600' }}>
              Número de Orden
            </p>
            <p style={{ margin: '0.5rem 0 0', color: '#2563EB', fontSize: '1.25rem', fontWeight: '800', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              #VIBRA-{Date.now().toString().slice(-8)}
            </p>
          </div>

          <div style={{
            background: '#FFF0F4',
            borderRadius: '10px',
            border: '1px solid #FF2E63',
            padding: '1rem',
            marginBottom: '2rem',
            display: 'flex',
            gap: '0.75rem',
            alignItems: 'flex-start',
          }}>
            <span style={{ color: '#FF2E63', fontSize: '1.25rem' }}>●</span>
            <div style={{ textAlign: 'left' }}>
              <p style={{ margin: 0, color: '#FF2E63', fontWeight: '700', fontSize: '0.9rem' }}>
                Acumulaste 210 puntos Vibra
              </p>
              <p style={{ margin: '0.25rem 0 0', color: '#71749E', fontSize: '0.8rem' }}>
                Canjéalos en tu próxima compra
              </p>
            </div>
          </div>

          <button
            onClick={handleNewPurchase}
            style={{
              width: '100%',
              height: '48px',
              backgroundColor: '#2563EB',
              color: '#fff',
              border: 'none',
              borderRadius: '10px',
              fontSize: '1rem',
              fontWeight: '800',
              cursor: 'pointer',
              fontFamily: 'Plus Jakarta Sans, sans-serif',
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
            }}
          >
            SEGUIR COMPRANDO →
          </button>
        </div>
      </main>

      <footer style={{ 
        background: '#fff', 
        padding: '2rem', 
        marginTop: 'auto',
        borderTop: '1px solid #E2E4F0',
      }}>
        <div style={{ textAlign: 'center' }}>
          <span style={{ color: '#71749E', fontSize: '0.8rem' }}>
            © 2024 VIBRA SHOP · ELECTRIC EDITORIAL
          </span>
        </div>
      </footer>
    </div>
  )
}

export default ConfirmationPage