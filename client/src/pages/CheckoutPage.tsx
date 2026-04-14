import { useState, useMemo } from 'react'
import { useCart } from '../hooks/useCart'
import { useNavigate } from 'react-router-dom'
import { useCheckoutState, clearCheckoutData } from '../context/CheckoutContext'
import { OrderForm, type FormData } from '../components/checkout/OrderForm'

const CheckoutPage = () => {
  const { items, clearCart } = useCart()
  const navigate = useNavigate()
  const { 
    formData: savedFormData, 
    isFormValid: savedIsFormValid,
    coupon, setCoupon,
    couponApplied, setCouponApplied
  } = useCheckoutState()
  
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleFormChange = (_data: FormData, _isValid: boolean) => {
  }

  const handleBackToCart = () => {
    navigate('/cart')
  }

  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  }, [items])

  const shipping = 0
  const discount = couponApplied ? subtotal * 0.1 : 0
  const total = subtotal + shipping - discount

  const handleApplyCoupon = () => {
    if (coupon.toUpperCase() === 'VIBRA10') {
      setCouponApplied(true)
    }
  }

  const handleSubmit = async () => {
    if (!savedFormData || !savedIsFormValid || submitted || items.length === 0) return
    setLoading(true)
    setSubmitted(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      clearCart()
      clearCheckoutData()
      navigate('/confirmation')
    } catch (error) {
      console.error(error)
      setSubmitted(false)
      alert('Hubo un error al procesar la orden. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F0F1F9' }}>
      <header style={{ 
        padding: '1rem 2rem', 
        background: '#F0F1F9',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid #E2E4F0',
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
        <nav style={{ display: 'flex', gap: '2rem', color: '#71749E' }}>
          <span style={{ cursor: 'pointer', fontWeight: '500' }}>Hombre</span>
          <span style={{ cursor: 'pointer', fontWeight: '500' }}>Mujer</span>
          <span style={{ cursor: 'pointer', fontWeight: '500' }}>Accesorios</span>
          <span style={{ cursor: 'pointer', fontWeight: '500', color: '#FF2E63' }}>Ofertas</span>
        </nav>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <button 
            onClick={handleBackToCart}
            style={{ 
              background: 'none', 
              border: '1px solid #E2E4F0', 
              borderRadius: '8px',
              padding: '0.5rem 1rem',
              cursor: 'pointer',
              color: '#71749E',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            ← Volver
          </button>
          <span style={{ color: '#71749E', cursor: 'pointer', fontSize: '1.25rem' }}>👤</span>
          <span style={{ color: '#71749E', cursor: 'pointer', fontSize: '1.25rem' }}>🛒</span>
        </div>
      </header>

      <main style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ 
            color: '#08060D', 
            fontFamily: 'Plus Jakarta Sans, sans-serif',
            fontSize: '2rem',
            margin: 0,
            fontWeight: '700',
          }}>
            Finalizar Compra
          </h1>
          <span style={{ color: '#2563EB', fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: '600' }}>
            🔒 PAGO SEGURO
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '2rem' }}>
          <OrderForm onFormChange={handleFormChange} />

          <div style={{ position: 'sticky', top: '2rem', height: 'fit-content' }}>
            <div style={{ 
              background: '#fff', 
              padding: '1.5rem', 
              borderRadius: '14px', 
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)', 
              border: '1px solid #E2E4F0',
              marginBottom: '1rem' 
            }}>
              <h2 style={{ 
                marginTop: 0, 
                marginBottom: '1.5rem', 
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                fontSize: '1.25rem',
                fontWeight: '800',
                textTransform: 'uppercase',
                color: '#08060D',
              }}>
                Tu Pedido
              </h2>

              {items.length === 0 ? (
                <p style={{ color: '#71749E', textAlign: 'center', padding: '2rem 0' }}>
                  No hay productos en el carrito
                </p>
              ) : (
                items.map(({ product, quantity }) => (
                  <div key={product.id} style={{
                    display: 'flex',
                    gap: '1rem',
                    padding: '0.75rem 0',
                    borderBottom: '1px solid #f0f0f0',
                  }}>
                    <img 
                      src={product.image} 
                      alt={product.name}
                      style={{ width: '56px', height: '56px', borderRadius: '8px' }}
                    />
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: 0, fontWeight: '500', fontSize: '0.9rem', color: '#08060D' }}>{product.name}</p>
                      <p style={{ margin: 0, color: '#71749E', fontSize: '0.8rem' }}>talla {product.size || 'S'} · {product.color || 'N/A'}</p>
                    </div>
                    <span style={{ fontWeight: '500', color: '#08060D' }}>${(product.price * quantity).toFixed(2)}</span>
                  </div>
                ))
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', fontSize: '0.9rem', color: '#71749E' }}>
                <span>Subtotal ({items.reduce((sum, i) => sum + i.quantity, 0)} productos)</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#FF2E63', margin: '0.25rem 0' }}>
                <span>Flete</span>
                <span>GRATIS</span>
              </div>
              {couponApplied && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#10B981' }}>
                  <span>Descuento</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '800', fontSize: '1.25rem', marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '2px solid #E2E4F0' }}>
                <span style={{ color: '#08060D' }}>Total</span>
                <span style={{ color: '#2563EB' }}>${total.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading || submitted || !savedIsFormValid || items.length === 0}
              style={{
                width: '100%',
                height: '52px',
                backgroundColor: loading || submitted || !savedIsFormValid || items.length === 0 ? '#9ca3af' : '#2563EB',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '800',
                cursor: loading || submitted || !savedIsFormValid || items.length === 0 ? 'not-allowed' : 'pointer',
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                boxShadow: loading || submitted || !savedIsFormValid || items.length === 0 ? 'none' : '0 4px 12px rgba(37, 99, 235, 0.3)',
              }}>
              {loading ? 'Procesando...' : 'Finalizar Compra →'}
            </button>

            <button
              onClick={handleBackToCart}
              style={{
                width: '100%',
                marginTop: '0.75rem',
                padding: '0.75rem',
                background: 'none',
                border: '1px solid #E2E4F0',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.9rem',
                color: '#71749E',
              }}>
              ← Volver al Carrito
            </button>

            <p style={{ textAlign: 'center', marginTop: '0.75rem', color: '#71749E', fontSize: '0.85rem' }}>
              🔒 Garantía de satisfacción de 30 días
            </p>

            <div style={{ 
              marginTop: '1.5rem', 
              padding: '1rem', 
              borderRadius: '14px',
              border: '2px dotted #FF2E63',
              background: '#fff',
            }}>
              <p style={{ margin: '0 0 0.75rem', fontWeight: '600', fontSize: '0.9rem', color: '#08060D' }}>
                ¿TIENES UN CÓDIGO?
              </p>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  placeholder="VIBRA10"
                  disabled={couponApplied}
                  style={{
                    flex: 1,
                    height: '40px',
                    padding: '0 1rem',
                    border: '2px solid #E2E4F0',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    outline: 'none',
                    backgroundColor: couponApplied ? '#EEF0FB' : '#fff',
                  }}
                />
                <button
                  onClick={handleApplyCoupon}
                  disabled={couponApplied || !coupon}
                  style={{
                    padding: '0 1rem',
                    backgroundColor: couponApplied ? '#10B981' : '#FF2E63',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: 'bold',
                    cursor: couponApplied || !coupon ? 'not-allowed' : 'pointer',
                  }}>
                  APLICAR
                </button>
              </div>
              {couponApplied && (
                <p style={{ margin: '0.5rem 0 0', color: '#10B981', fontSize: '0.85rem', fontWeight: '500' }}>
                  ¡Cupón aplicado! -${discount.toFixed(2)}
                </p>
              )}
            </div>
          </div>
        </div>
      </main>

      <footer style={{ 
        background: '#F0F1F9', 
        padding: '3rem 2rem', 
        marginTop: '4rem',
        borderTop: '1px solid #E2E4F0',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem' }}>
          <div>
            <h3 style={{ color: '#08060D', fontWeight: '800', margin: '0 0 0.75rem', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              Vibra Shop
            </h3>
            <p style={{ color: '#71749E', fontSize: '0.9rem', margin: 0 }}>
              Transformando la moda urbana con energía eléctrica desde 2024
            </p>
            <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
              <span style={{ color: '#2563EB', cursor: 'pointer', fontSize: '1.25rem' }}>📷</span>
              <span style={{ color: '#2563EB', cursor: 'pointer', fontSize: '1.25rem' }}>🐦</span>
              <span style={{ color: '#2563EB', cursor: 'pointer', fontSize: '1.25rem' }}>🎵</span>
            </div>
          </div>

          <div>
            <h4 style={{ color: '#08060D', fontWeight: '600', margin: '0 0 1rem', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              PRODUCTO
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '0.5rem' }}><span style={{ color: '#71749E', cursor: 'pointer' }}>Hombre</span></li>
              <li style={{ marginBottom: '0.5rem' }}><span style={{ color: '#71749E', cursor: 'pointer' }}>Mujer</span></li>
              <li style={{ marginBottom: '0.5rem' }}><span style={{ color: '#71749E', cursor: 'pointer' }}>Accesorios</span></li>
              <li><span style={{ color: '#FF2E63', cursor: 'pointer' }}>Ofertas</span></li>
            </ul>
          </div>

          <div>
            <h4 style={{ color: '#08060D', fontWeight: '600', margin: '0 0 1rem', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              LEGAL
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '0.5rem' }}><span style={{ color: '#71749E', cursor: 'pointer' }}>Privacidad</span></li>
              <li style={{ marginBottom: '0.5rem' }}><span style={{ color: '#71749E', cursor: 'pointer' }}>Términos</span></li>
              <li><span style={{ color: '#71749E', cursor: 'pointer' }}>Envíos</span></li>
            </ul>
          </div>

          <div>
            <h4 style={{ color: '#08060D', fontWeight: '600', margin: '0 0 1rem', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              NEWSLETTER
            </h4>
            <p style={{ color: '#71749E', fontSize: '0.9rem', margin: '0 0 1rem' }}>
              Suscríbete para ofertas exclusivas
            </p>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="email"
                placeholder="tu@email.com"
                style={{
                  flex: 1,
                  height: '40px',
                  padding: '0 1rem',
                  border: '2px solid #E2E4F0',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  outline: 'none',
                  backgroundColor: '#fff',
                }}
              />
              <button
                style={{
                  padding: '0 1rem',
                  backgroundColor: '#2563EB',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                }}>
                →
              </button>
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px solid #E2E4F0' }}>
          <span style={{ color: '#71749E', fontSize: '0.85rem' }}>
            © 2024 VIBRA SHOP · ELECTRIC EDITORIAL
          </span>
        </div>
      </footer>
    </div>
  )
}

export default CheckoutPage