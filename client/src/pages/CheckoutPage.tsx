import { useState } from 'react'
import { useCart } from '../hooks/useCart'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

interface FormData {
  name: string
  address: string
  city: string
  phone: string
  email: string
  paymentMethod: string
}

interface FormErrors {
  name?: string
  address?: string
  city?: string
  phone?: string
  email?: string
  paymentMethod?: string
}

const CheckoutPage = () => {
  const { items, total, clearCart } = useCart()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const [form, setForm] = useState<FormData>({
    name: '',
    address: '',
    city: '',
    phone: '',
    email: '',
    paymentMethod: '',
  })

  const [errors, setErrors] = useState<FormErrors>({})

  const validate = (): boolean => {
    const newErrors: FormErrors = {}
    if (!form.name.trim()) newErrors.name = 'El nombre es obligatorio'
    if (!form.address.trim()) newErrors.address = 'La dirección es obligatoria'
    if (!form.city.trim()) newErrors.city = 'La ciudad es obligatoria'
    if (!form.phone.trim()) newErrors.phone = 'El teléfono es obligatorio'
    else if (!/^\d{7,10}$/.test(form.phone)) newErrors.phone = 'Teléfono inválido (7-10 dígitos)'
    if (!form.email.trim()) newErrors.email = 'El correo es obligatorio'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = 'Correo inválido'
    if (!form.paymentMethod) newErrors.paymentMethod = 'Selecciona un método de pago'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  const handleSubmit = async () => {
    if (!validate() || submitted) return
    setLoading(true)
    setSubmitted(true)
    try {
      await axios.post('http://localhost:3000/api/orders', {
        userId: 1,
        name: form.name,
        address: form.address,
        city: form.city,
        phone: form.phone,
        paymentMethod: form.paymentMethod,
        items: items.map(({ product, quantity }) => ({
          productId: product.id,
          quantity,
          price: product.price,
        })),
      })
      clearCart()
      navigate('/confirmation')
    } catch (error) {
      console.error(error)
      setSubmitted(false)
      alert('Hubo un error al procesar la orden. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = (hasError: boolean) => ({
    width: '100%',
    padding: '0.65rem',
    border: `1px solid ${hasError ? '#e53e3e' : '#ccc'}`,
    borderRadius: '6px',
    fontSize: '1rem',
    boxSizing: 'border-box' as const,
    outline: 'none',
  })

  const labelStyle = {
    display: 'block',
    marginBottom: '0.3rem',
    fontWeight: '500' as const,
    fontSize: '0.9rem',
  }

  const errorStyle = {
    color: '#e53e3e',
    fontSize: '0.8rem',
    marginTop: '0.25rem',
  }

  const fieldStyle = {
    marginBottom: '1.2rem',
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem' }}>
      <h1 style={{ marginBottom: '2rem' }}>Finalizar Compra</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '2rem' }}>

        {/* FORMULARIO */}
        <div style={{ background: '#fff', padding: '2rem', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <h2 style={{ marginTop: 0, marginBottom: '1.5rem' }}>Datos de envío</h2>

          <div style={fieldStyle}>
            <label style={labelStyle}>Nombre completo *</label>
            <input name="name" value={form.name} onChange={handleChange}
              placeholder="Ej: Juan Pérez" style={inputStyle(!!errors.name)} />
            {errors.name && <p style={errorStyle}>{errors.name}</p>}
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Dirección de envío *</label>
            <input name="address" value={form.address} onChange={handleChange}
              placeholder="Ej: Calle 123 # 45-67" style={inputStyle(!!errors.address)} />
            {errors.address && <p style={errorStyle}>{errors.address}</p>}
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Ciudad *</label>
            <input name="city" value={form.city} onChange={handleChange}
              placeholder="Ej: Bogotá" style={inputStyle(!!errors.city)} />
            {errors.city && <p style={errorStyle}>{errors.city}</p>}
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Teléfono de contacto *</label>
            <input name="phone" value={form.phone} onChange={handleChange}
              placeholder="Ej: 3001234567" style={inputStyle(!!errors.phone)} />
            {errors.phone && <p style={errorStyle}>{errors.phone}</p>}
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Correo electrónico *</label>
            <input name="email" value={form.email} onChange={handleChange}
              placeholder="Ej: juan@correo.com" style={inputStyle(!!errors.email)} />
            {errors.email && <p style={errorStyle}>{errors.email}</p>}
          </div>

          <h2 style={{ marginBottom: '1rem' }}>Método de pago</h2>
          {errors.paymentMethod && <p style={errorStyle}>{errors.paymentMethod}</p>}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {['Tarjeta de crédito', 'Tarjeta débito', 'PSE', 'Efectivo contra entrega'].map(method => (
              <label key={method} style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                padding: '0.75rem 1rem',
                border: `2px solid ${form.paymentMethod === method ? '#000' : '#eee'}`,
                borderRadius: '8px', cursor: 'pointer',
                background: form.paymentMethod === method ? '#f5f5f5' : '#fff'
              }}>
                <input type="radio" name="paymentMethod" value={method}
                  checked={form.paymentMethod === method}
                  onChange={handleChange}
                  style={{ accentColor: '#000' }} />
                {method}
              </label>
            ))}
          </div>
        </div>

        {/* RESUMEN */}
        <div>
          <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', marginBottom: '1rem' }}>
            <h2 style={{ marginTop: 0 }}>Resumen de compra</h2>
            {items.map(({ product, quantity }) => (
              <div key={product.id} style={{
                display: 'flex', justifyContent: 'space-between',
                padding: '0.5rem 0', borderBottom: '1px solid #f0f0f0', fontSize: '0.9rem'
              }}>
                <span>{product.name} × {quantity}</span>
                <span>${(product.price * quantity).toLocaleString('es-CO')}</span>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.75rem', fontSize: '0.9rem', color: '#666' }}>
              <span>Subtotal</span>
              <span>${total.toLocaleString('es-CO')}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#666', margin: '0.25rem 0' }}>
              <span>Envío</span>
              <span style={{ color: 'green' }}>Gratis</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.1rem', marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '2px solid #000' }}>
              <span>Total</span>
              <span>${total.toLocaleString('es-CO')}</span>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading || submitted}
            style={{
              width: '100%',
              padding: '1rem',
              backgroundColor: loading || submitted ? '#999' : '#000',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: loading || submitted ? 'not-allowed' : 'pointer',
            }}>
            {loading ? 'Procesando...' : 'Confirmar compra'}
          </button>

          <button
            onClick={() => navigate('/cart')}
            style={{
              width: '100%', marginTop: '0.75rem',
              padding: '0.75rem', background: 'none',
              border: '1px solid #ccc', borderRadius: '8px',
              cursor: 'pointer', fontSize: '0.9rem'
            }}>
            ← Volver al carrito
          </button>
        </div>
      </div>
    </div>
  )
}

export default CheckoutPage