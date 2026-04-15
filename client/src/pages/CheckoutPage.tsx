import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { OrderForm, type FormData } from '../components/checkout/OrderForm'
import { useCart } from '../hooks/useCart'
import { useCheckoutState } from '../context/CheckoutContext'
import type { CompletedOrder } from '../types'

const CheckoutPage = () => {
  const navigate = useNavigate()
  const { items, clearCart } = useCart()
  const {
    formData,
    isFormValid,
    coupon,
    setCoupon,
    couponApplied,
    setCouponApplied,
    setLastOrder,
    resetCheckout,
  } = useCheckoutState()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [couponMessage, setCouponMessage] = useState('')
  const paymentMethod = formData?.paymentMethod ?? 'tarjeta'

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    [items],
  )
  const shipping = items.length > 0 ? 0 : 0
  const discount = couponApplied ? subtotal * 0.1 : 0
  const total = subtotal + shipping - discount

  const handleFormChange = (_data: FormData, _isValid: boolean) => {
    setCouponMessage('')
  }

  const handleApplyCoupon = () => {
    if (coupon.trim().toUpperCase() !== 'VIBRA10') {
      setCouponApplied(false)
      setCouponMessage('Codigo invalido. Usa VIBRA10 para el descuento simulado.')
      return
    }

    setCouponApplied(true)
    setCouponMessage('Descuento aplicado correctamente.')
  }

  const handleSubmit = async () => {
    if (!formData || !isFormValid || items.length === 0 || isSubmitting) {
      return
    }

    const completedFormData = formData as CompletedOrder['formData']

    setIsSubmitting(true)

    const orderPayload = {
      name: completedFormData.fullName,
      email: completedFormData.email,
      address: completedFormData.address,
      city: completedFormData.city,
      country: completedFormData.country,
      postalCode: completedFormData.postalCode,
      phone: completedFormData.phone,
      paymentMethod: completedFormData.paymentMethod,
      items: items.map(({ product, quantity }) => ({
        productId: product.id,
        name: product.name,
        image: product.image,
        description: product.description,
        quantity,
        price: product.price,
      })),
    }

    const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'

    const response = await fetch(`${apiBaseUrl}/api/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderPayload),
    })

    if (!response.ok) {
      setIsSubmitting(false)
      setCouponMessage('No se pudo guardar la compra. Intenta nuevamente.')
      return
    }

    const result = await response.json()

    setLastOrder({
      id: `VIBRA-${String(result?.order?.id ?? Date.now()).slice(-8)}`,
      createdAt: new Date().toISOString(),
      items,
      subtotal,
      shipping,
      discount,
      total,
      formData: completedFormData,
    })

    clearCart()
    resetCheckout()
    navigate('/processing-payment')
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen px-4 py-8 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-6xl overflow-hidden rounded-[32px] border border-white/70 bg-white/50 shadow-soft backdrop-blur">
          <header className="flex items-center justify-between border-b border-line/80 px-6 py-4">
            <span className="font-display text-lg font-extrabold uppercase tracking-[0.12em] text-brand-600">
              Vibra Shop
            </span>
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-ink-500">
              No hay productos para pagar
            </span>
          </header>

          <main className="px-6 py-12 md:px-10">
            <div className="mx-auto max-w-xl rounded-[28px] bg-white px-6 py-10 text-center shadow-soft">
              <h1 className="font-display text-3xl font-bold text-ink-900">No puedes confirmar una compra vacia</h1>
              <p className="mt-3 text-sm text-ink-700">
                Vuelve al carrito, agrega productos y completa el formulario para continuar.
              </p>
              <button
                className="mt-6 inline-flex h-12 items-center justify-center rounded-2xl border border-line px-6 text-sm font-semibold text-ink-900 transition hover:bg-brand-50"
                onClick={() => navigate('/cart')}
              >
                Volver al carrito
              </button>
            </div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-[32px] border border-white/70 bg-white/50 shadow-soft backdrop-blur">
        <header className="flex items-center justify-between border-b border-line/80 px-6 py-4 md:px-8">
          <span className="font-display text-lg font-extrabold uppercase tracking-[0.12em] text-brand-600">
            Vibra Shop
          </span>
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-ink-500">
            Pago seguro
          </span>
        </header>

        <main className="px-5 py-8 md:px-8 md:py-10">
          <div className="mb-5">
            <button
              className="inline-flex h-11 items-center justify-center rounded-2xl border border-line bg-white px-5 text-sm font-semibold text-ink-900 transition hover:bg-brand-50"
              onClick={() => navigate('/cart')}
            >
              Volver al carrito
            </button>
          </div>

          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] xl:grid-cols-[minmax(0,1fr)_360px]">
            <section>
              <OrderForm onFormChange={handleFormChange} />
            </section>

            <aside className="space-y-5">
              <div className="rounded-[28px] bg-white px-5 py-6 shadow-soft">
                <h2 className="font-display text-2xl font-bold italic tracking-[-0.03em] text-ink-900">
                  Tu Pedido
                </h2>

                <div className="mt-5 space-y-4 border-b border-line pb-5">
                  {items.map(({ product, quantity }) => (
                    <article key={product.id} className="flex items-center gap-3">
                      <img
                        className="h-14 w-14 rounded-2xl border border-line object-cover"
                        src={product.image}
                        alt={product.name}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-ink-900">{product.name}</p>
                        <p className="text-xs text-ink-500">
                          Talla: {product.size} | Color: {product.color}
                        </p>
                        <p className="text-xs text-ink-500">Cantidad: {quantity}</p>
                      </div>
                      <strong className="text-sm font-bold text-ink-900">
                        ${(product.price * quantity).toFixed(2)}
                      </strong>
                    </article>
                  ))}
                </div>

                <div className="mt-5 space-y-3 text-sm text-ink-700">
                  <div className="flex items-center justify-between">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Envio</span>
                    <span className="font-bold uppercase text-danger">Gratis</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Metodo de pago</span>
                    <span className="font-semibold text-ink-900">
                      {paymentMethod === 'paypal' ? 'PayPal' : 'Tarjeta'}
                    </span>
                  </div>
                  {couponApplied && (
                    <div className="flex items-center justify-between text-success">
                      <span>Descuento</span>
                      <span>-${discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between border-t border-line pt-3 font-display text-2xl font-extrabold text-brand-600">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  className="mt-5 flex h-14 w-full items-center justify-center rounded-2xl bg-brand-500 px-6 text-sm font-bold uppercase tracking-[0.08em] text-white shadow-[0_16px_30px_rgba(79,110,247,0.35)] transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:bg-slate-400 disabled:shadow-none"
                  onClick={handleSubmit}
                  disabled={!isFormValid || items.length === 0 || isSubmitting}
                >
                  {isSubmitting
                    ? 'Procesando compra...'
                    : paymentMethod === 'paypal'
                      ? 'Pagar con PayPal'
                      : 'Finalizar compra'}
                </button>

                <p className="mt-3 text-center text-[11px] font-medium uppercase tracking-[0.1em] text-ink-500">
                  Garantia de satisfaccion 30 dias
                </p>
              </div>

              <div className="rounded-[28px] border border-dashed border-rose-300 bg-white px-5 py-5 shadow-soft">
                <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-rose-500">
                  ¿Tienes un codigo?
                </p>
                <div className="mt-3 flex gap-3">
                  <input
                    className="h-11 min-w-0 flex-1 rounded-2xl border border-line bg-[#f7f5ff] px-4 text-sm outline-none transition focus:border-brand-400 focus:bg-white focus:ring-4 focus:ring-brand-100"
                    value={coupon}
                    onChange={(event) => setCoupon(event.target.value)}
                    placeholder="VIBRA10"
                    disabled={couponApplied}
                  />
                  <button
                    className="h-11 rounded-2xl bg-rose-500 px-4 text-xs font-bold uppercase tracking-[0.08em] text-white transition hover:bg-rose-600 disabled:cursor-not-allowed disabled:bg-rose-300"
                    onClick={handleApplyCoupon}
                    disabled={couponApplied || coupon.trim() === ''}
                  >
                    Aplicar
                  </button>
                </div>
                {couponMessage && <p className="mt-3 text-sm text-ink-700">{couponMessage}</p>}
              </div>
            </aside>
          </div>
        </main>

        <footer className="grid gap-8 border-t border-line/80 px-6 py-10 text-sm text-ink-700 md:grid-cols-4 md:px-8">
          <div>
            <h3 className="font-display text-base font-bold text-ink-900">Vibra Shop</h3>
            <p className="mt-2 text-xs leading-6 text-ink-500">
              Transformando la moda urbana con energia electrica desde 2024.
            </p>
          </div>

          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-[0.12em] text-brand-500">Ayuda</h3>
            <p className="mt-3 text-sm">Soporte</p>
            <p className="mt-1 text-sm">Envios</p>
          </div>

          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-[0.12em] text-brand-500">Legal</h3>
            <p className="mt-3 text-sm">Privacidad</p>
            <p className="mt-1 text-sm">Terminos</p>
          </div>

          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-[0.12em] text-brand-500">Newsletter</h3>
            <p className="mt-3 text-xs leading-6 text-ink-500">Suscribete para ofertas exclusivas.</p>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default CheckoutPage
