import { useEffect } from 'react'
import { useCart } from '../hooks/useCart'
import { useNavigate } from 'react-router-dom'

const productosDemo = [
  { id: 1, name: 'Camiseta Oversize', price: 45000, image: 'https://placehold.co/80x80', description: 'Camiseta estilo urbano' },
  { id: 2, name: 'Jogger Cargo', price: 89000, image: 'https://placehold.co/80x80', description: 'Pantalón cargo juvenil' },
]

const CartPage = () => {
  const { items, removeItem, updateQuantity, total, itemCount, addItem } = useCart()
  const navigate = useNavigate()

  useEffect(() => {
    if (items.length === 0) {
      productosDemo.forEach(p => addItem(p))
    }
  }, [addItem, items.length])

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem' }}>
      <h1>🛒 Carrito de Compras</h1>

      {items.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <p>Tu carrito está vacío</p>
        </div>
      ) : (
        <>
          {items.map(({ product, quantity }) => (
            <div key={product.id} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              padding: '1rem',
              borderBottom: '1px solid #eee'
            }}>
              <img src={product.image} alt={product.name}
                style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' }} />
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: 0 }}>{product.name}</h3>
                <p style={{ margin: '0.25rem 0', color: '#666' }}>
                  ${product.price.toLocaleString('es-CO')}
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button onClick={() => updateQuantity(product.id, quantity - 1)}
                  style={{ padding: '0.25rem 0.75rem', cursor: 'pointer' }}>−</button>
                <span>{quantity}</span>
                <button onClick={() => updateQuantity(product.id, quantity + 1)}
                  style={{ padding: '0.25rem 0.75rem', cursor: 'pointer' }}>+</button>
              </div>
              <p style={{ minWidth: '100px', textAlign: 'right', fontWeight: 'bold' }}>
                ${(product.price * quantity).toLocaleString('es-CO')}
              </p>
              <button onClick={() => removeItem(product.id)}
                style={{ color: 'red', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}>
                ✕
              </button>
            </div>
          ))}

          <div style={{ marginTop: '2rem', textAlign: 'right' }}>
            <p style={{ fontSize: '1.1rem' }}>
              {itemCount} producto(s) | Total:
              <strong> ${total.toLocaleString('es-CO')}</strong>
            </p>
            <button
              onClick={() => navigate('/checkout')}
              style={{
                backgroundColor: '#000',
                color: '#fff',
                padding: '0.75rem 2rem',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                cursor: 'pointer',
                marginTop: '1rem'
              }}>
              Ir a pagar →
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default CartPage