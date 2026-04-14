import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../hooks/useCart'
import type { Product } from '../types'

const DEMO_PRODUCTS: Product[] = [
  { id: 1, name: 'Nitro Runner "Acid"', size: '43', color: 'Rojo Eléctrico', price: 129.00, image: 'https://placehold.co/100x100/E2E4F0/71749E?text=Runner' },
  { id: 2, name: 'Vibra Smart Gear VI', size: 'M', color: 'Básico Minimal', price: 85.50, image: 'https://placehold.co/100x100/E2E4F0/71749E?text=Gear' },
  { id: 3, name: 'Boxy Tee "Essentials"', size: 'L', color: 'Negro Obsidiana', price: 45.00, image: 'https://placehold.co/100x100/E2E4F0/71749E?text=Tee' },
]

const COMPLETE_LOOK_PRODUCTS = [
  { id: 4, name: 'Crew Socks X', price: 32.00, image: 'https://placehold.co/80x80/E2E4F0/71749E?text=Socks' },
  { id: 5, name: 'VibraBasket', price: 25.00, image: 'https://placehold.co/80x80/E2E4F0/71749E?text=Basket' },
  { id: 6, name: 'Tech Pack 01', price: 95.00, image: 'https://placehold.co/80x80/E2E4F0/71749E?text=Pack' },
  { id: 7, name: 'Winter Cap', price: 18.00, image: 'https://placehold.co/80x80/E2E4F0/71749E?text=Cap' },
]

const CartPage = () => {
  const navigate = useNavigate()
  const { items, addItem, removeItem, updateQuantity, total, itemCount: cartItemCount } = useCart()
  const [coupon, setCoupon] = useState('')

  useEffect(() => {
    if (items.length === 0) {
      DEMO_PRODUCTS.forEach(product => {
        addItem(product, product.id === 3 ? 2 : 1)
      })
    }
  }, [items.length, addItem])

  const subtotal = total
  const shipping = 12.00
  const taxes = 21.15
  const finalTotal = subtotal + shipping + taxes

  const handleQuantityChange = (productId: number, delta: number) => {
    const item = items.find(i => i.product.id === productId)
    if (item) {
      const newQty = item.quantity + delta
      if (newQty <= 0) {
        removeItem(productId)
      } else {
        updateQuantity(productId, newQty)
      }
    }
  }

  const handleApplyCoupon = () => {
    console.log('Applying coupon:', coupon)
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
        <span style={{ fontSize: '1.5rem', fontWeight: '800', fontFamily: 'Plus Jakarta Sans, sans-serif', color: '#2563EB' }}>
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
          <div style={{ position: 'relative', cursor: 'pointer' }}>
            <span style={{ color: '#1A1A2E', fontSize: '1.25rem' }}>🛒</span>
            <span style={{ position: 'absolute', top: '-8px', right: '-8px', background: '#FF2E63', color: '#fff', fontSize: '0.65rem', fontWeight: 'bold', width: '18px', height: '18px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {cartItemCount}
            </span>
          </div>
        </div>
      </header>

      <main style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <p style={{ color: '#71749E', fontSize: '0.8rem', fontWeight: '500', textTransform: 'uppercase', margin: '0 0 0.5rem' }}>TU SELECCIÓN</p>
        <h1 style={{ color: '#1A1A2E', fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '2.5rem', margin: '0 0 2rem' }}>
          Mi Carrito <span style={{ fontWeight: '800' }}>Vibrante.</span>
        </h1>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '2rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {items.map(({ product, quantity }) => (
              <div key={product.id} style={{ background: '#fff', borderRadius: '12px', border: '1px solid #E2E4F0', padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                <img src={product.image} alt={product.name} style={{ width: '100px', height: '100px', borderRadius: '8px', background: '#F0F1F9' }} />
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontWeight: '700', fontSize: '1rem', color: '#1A1A2E' }}>"{product.name.split('"')[1]}"</p>
                  <p style={{ margin: '0.25rem 0 0', color: '#71749E', fontSize: '0.85rem' }}>Talla {product.size} · {product.color}</p>
                  <button onClick={() => removeItem(product.id)} style={{ background: 'none', border: 'none', color: '#FF2E63', fontSize: '0.8rem', cursor: 'pointer', padding: 0, marginTop: '0.5rem' }}>Eliminar</button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.75rem' }}>
                  <span style={{ fontWeight: '700', fontSize: '1.1rem', color: '#1A1A2E' }}>${product.price.toFixed(2)}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <button onClick={() => handleQuantityChange(product.id, -1)} style={{ width: '28px', height: '28px', borderRadius: '50%', border: '1px solid #E2E4F0', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', color: '#71749E' }}>−</button>
                    <span style={{ minWidth: '20px', textAlign: 'center', fontSize: '0.9rem' }}>{quantity}</span>
                    <button onClick={() => handleQuantityChange(product.id, 1)} style={{ width: '28px', height: '28px', borderRadius: '50%', border: '1px solid #E2E4F0', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', color: '#71749E' }}>+</button>
                  </div>
                </div>
              </div>
            ))}

            <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #E2E4F0', padding: '1.5rem' }}>
              <p style={{ color: '#71749E', fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', margin: '0 0 1rem', letterSpacing: '0.05em' }}>COMPLETA EL LOOK</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
                {COMPLETE_LOOK_PRODUCTS.map(product => (
                  <div key={product.id}>
                    <img src={product.image} alt={product.name} style={{ width: '100%', aspectRatio: '1', borderRadius: '8px', objectFit: 'cover', background: '#F0F1F9' }} />
                    <p style={{ margin: '0.5rem 0 0.25rem', fontSize: '0.8rem', color: '#1A1A2E', fontWeight: '500' }}>{product.name}</p>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#2563EB', fontWeight: '600' }}>${product.price.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ position: 'sticky', top: '100px', height: 'fit-content' }}>
            <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #E2E4F0', padding: '1.5rem' }}>
              <h2 style={{ margin: '0 0 1.5rem', fontWeight: '700', fontSize: '1.1rem', color: '#1A1A2E' }}>Resumen de Pedido</h2>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', color: '#71749E', fontSize: '0.9rem' }}>
                <span>Subtotal ({cartItemCount} productos)</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', color: '#71749E', fontSize: '0.9rem' }}>
                <span>Envío Estándar</span>
                <span>${shipping.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', color: '#71749E', fontSize: '0.9rem' }}>
                <span>Impuestos</span>
                <span>${taxes.toFixed(2)}</span>
              </div>
              <div style={{ borderTop: '1px solid #E2E4F0', marginBottom: '1rem' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <span style={{ fontWeight: '700', fontSize: '1.1rem', color: '#1A1A2E' }}>TOTAL</span>
                <span style={{ fontWeight: '800', fontSize: '1.25rem', color: '#2563EB' }}>${finalTotal.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <input type="text" value={coupon} onChange={(e) => setCoupon(e.target.value)} placeholder="Código de descuento" style={{ flex: 1, height: '40px', padding: '0 1rem', border: '1px solid #E2E4F0', borderRadius: '8px', fontSize: '0.85rem', outline: 'none', backgroundColor: '#EEF0FB' }} />
                <button onClick={handleApplyCoupon} style={{ padding: '0 1rem', backgroundColor: '#2563EB', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: '600', fontSize: '0.85rem', cursor: 'pointer' }}>APLICAR</button>
              </div>
              <button onClick={() => navigate('/checkout')} style={{ width: '100%', height: '48px', backgroundColor: '#2563EB', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '1rem', fontWeight: '800', cursor: 'pointer', fontFamily: 'Plus Jakarta Sans, sans-serif', boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)', marginBottom: '1rem' }}>IR A PAGAR →</button>
              <p style={{ textAlign: 'center', color: '#71749E', fontSize: '0.75rem', marginBottom: '0.75rem' }}>MÉTODOS DE PAGO SEGUROS</p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                {['Visa', 'Mastercard', 'PayPal', 'American Express'].map(card => (<span key={card} style={{ color: '#71749E', fontSize: '0.7rem', fontWeight: '500' }}>{card}</span>))}
              </div>
              <div style={{ background: '#FFF0F4', borderRadius: '10px', border: '1px solid #FF2E63', padding: '1rem', display: 'flex', gap: '0.75rem' }}>
                <span style={{ color: '#FF2E63', fontSize: '1.5rem' }}>●</span>
                <div>
                  <p style={{ margin: 0, color: '#FF2E63', fontWeight: '700', fontSize: '0.9rem' }}>Puntos Vibra</p>
                  <p style={{ margin: '0.25rem 0 0', color: '#71749E', fontSize: '0.75rem' }}>Continúa comprando y acumularás {Math.floor(subtotal / 10)} puntos para tu próximo descuento exclusivo.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer style={{ background: '#fff', padding: '3rem 2rem', marginTop: '4rem', borderTop: '1px solid #E2E4F0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem' }}>
          <div>
            <h3 style={{ color: '#1A1A2E', fontWeight: '800', margin: '0 0 0.5rem', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>VIBRA SHOP</h3>
            <p style={{ color: '#71749E', fontSize: '0.8rem', margin: '0 0 0.75rem' }}>© 2024 VIBRA SHOP. ELECTRIC EDITORIAL.</p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <span style={{ color: '#1A1A2E', cursor: 'pointer', fontSize: '1.1rem' }}>📺</span>
              <span style={{ color: '#1A1A2E', cursor: 'pointer', fontSize: '1.1rem' }}>✉</span>
            </div>
          </div>
          <div>
            <h4 style={{ color: '#71749E', fontWeight: '600', margin: '0 0 1rem', fontSize: '0.75rem', textTransform: 'uppercase' }}>PRODUCTO</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '0.5rem' }}><span style={{ color: '#1A1A2E', cursor: 'pointer', fontSize: '0.85rem' }}>HOMBRE</span></li>
              <li style={{ marginBottom: '0.5rem' }}><span style={{ color: '#1A1A2E', cursor: 'pointer', fontSize: '0.85rem' }}>MUJER</span></li>
              <li><span style={{ color: '#1A1A2E', cursor: 'pointer', fontSize: '0.85rem' }}>ACCESORIOS</span></li>
            </ul>
          </div>
          <div>
            <h4 style={{ color: '#71749E', fontWeight: '600', margin: '0 0 1rem', fontSize: '0.75rem', textTransform: 'uppercase' }}>AYUDA</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '0.5rem' }}><span style={{ color: '#1A1A2E', cursor: 'pointer', fontSize: '0.85rem' }}>PRIVACIDAD</span></li>
              <li style={{ marginBottom: '0.5rem' }}><span style={{ color: '#1A1A2E', cursor: 'pointer', fontSize: '0.85rem' }}>SOPORTE</span></li>
              <li><span style={{ color: '#1A1A2E', cursor: 'pointer', fontSize: '0.85rem' }}>ENVÍOS</span></li>
            </ul>
          </div>
          <div>
            <h4 style={{ color: '#71749E', fontWeight: '600', margin: '0 0 1rem', fontSize: '0.75rem', textTransform: 'uppercase' }}>SUSCRÍBETE PARA OFERTAS</h4>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <span style={{ color: '#1A1A2E', cursor: 'pointer', fontSize: '1.1rem' }}>📺</span>
              <span style={{ color: '#1A1A2E', cursor: 'pointer', fontSize: '1.1rem' }}>✉</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default CartPage