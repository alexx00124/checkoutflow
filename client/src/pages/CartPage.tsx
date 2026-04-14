import { useNavigate } from 'react-router-dom'
import { useCart } from '../hooks/useCart'
import type { Product } from '../types'

const DEMO_PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Nitro Runner Acid',
    size: '43',
    color: 'Rojo Electrico',
    price: 129,
    image: 'https://placehold.co/100x100/E2E4F0/71749E?text=Runner',
  },
  {
    id: 2,
    name: 'Vibra Smart Gear VI',
    size: 'M',
    color: 'Blanco Lunar',
    price: 85.5,
    image: 'https://placehold.co/100x100/E2E4F0/71749E?text=Gear',
  },
  {
    id: 3,
    name: 'Boxy Tee Essentials',
    size: 'L',
    color: 'Negro Obsidiana',
    price: 45,
    image: 'https://placehold.co/100x100/E2E4F0/71749E?text=Tee',
  },
  {
    id: 4,
    name: 'Crew Socks X',
    size: 'Unica',
    color: 'Gris Humo',
    price: 18,
    image: 'https://placehold.co/100x100/E2E4F0/71749E?text=Socks',
  },
]

const CartPage = () => {
  const navigate = useNavigate()
  const { items, addItem, removeItem, updateQuantity, total, itemCount } = useCart()

  const subtotal = total
  const shipping = items.length > 0 ? 0 : 0
  const totalFinal = subtotal + shipping

  const handleCheckout = () => {
    if (items.length === 0) {
      return
    }

    navigate('/checkout')
  }

  return (
    <div className="min-h-screen px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-[32px] border border-white/70 bg-white/50 shadow-soft backdrop-blur">
        <header className="flex items-center justify-between border-b border-line/80 px-6 py-4 md:px-8">
          <span className="font-display text-lg font-extrabold uppercase tracking-[0.12em] text-brand-600">
            Vibra Shop
          </span>
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-ink-500">
            Carrito activo: {itemCount} producto(s)
          </span>
        </header>

        <main className="px-5 py-8 md:px-8 md:py-10">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.12em] text-brand-500">Paso 1 de 3</span>
              <h1 className="mt-2 font-display text-4xl font-bold tracking-[-0.04em] text-ink-900">
                Tu carrito
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-ink-700">
                Revisa los productos seleccionados antes de pasar al checkout.
              </p>
            </div>

            <button
              className="inline-flex h-12 items-center justify-center rounded-2xl bg-brand-500 px-6 text-sm font-bold text-white shadow-[0_16px_30px_rgba(79,110,247,0.28)] transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:bg-slate-400 disabled:shadow-none"
              onClick={handleCheckout}
              disabled={items.length === 0}
            >
              Ir al checkout
            </button>
          </div>

          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] xl:grid-cols-[minmax(0,1fr)_360px]">
            <section className="space-y-6">
             {items.length === 0 ? (
                <div className="rounded-[28px] bg-white px-6 py-10 text-center shadow-soft">
                  <h2 className="font-display text-3xl font-bold text-ink-900">Tu carrito esta vacio</h2>
                  <p className="mt-3 text-sm text-ink-700">
                    Agrega productos para habilitar el checkout y la confirmacion de compra.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map(({ product, quantity }) => (
                    <article
                      key={product.id}
                      className="grid gap-4 rounded-[28px] bg-white p-5 shadow-soft md:grid-cols-[72px_minmax(0,1fr)_auto_auto] md:items-center"
                    >
                      <img className="h-[72px] w-[72px] rounded-2xl border border-line object-cover" src={product.image} alt={product.name} />
                      <div className="min-w-0">
                        <strong className="block truncate text-base font-bold text-ink-900">{product.name}</strong>
                        <span className="mt-1 block text-sm text-ink-500">
                          Talla {product.size} · {product.color}
                        </span>
                        <button
                          type="button"
                          className="mt-3 text-sm font-semibold text-danger"
                          onClick={() => removeItem(product.id)}
                        >
                          Eliminar
                        </button>
                      </div>
                      <div className="inline-flex items-center gap-2 rounded-2xl border border-line bg-shell px-2 py-2">
                        <button
                          type="button"
                          className="flex h-8 w-8 items-center justify-center rounded-xl bg-white text-sm font-bold text-ink-900"
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                        >
                          -
                        </button>
                        <span className="min-w-6 text-center text-sm font-semibold text-ink-900">{quantity}</span>
                        <button
                          type="button"
                          className="flex h-8 w-8 items-center justify-center rounded-xl bg-white text-sm font-bold text-ink-900"
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                      <strong className="text-right text-base font-bold text-ink-900 md:min-w-24">
                        ${(product.price * quantity).toFixed(2)}
                      </strong>
                    </article>
                  ))}
                </div>
              )}

              <section className="rounded-[28px] bg-white p-6 shadow-soft">
                <h2 className="font-display text-2xl font-bold text-ink-900">Agrega algo mas</h2>
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                {DEMO_PRODUCTS.map((product) => (
                    <article key={product.id} className="grid grid-cols-[56px_minmax(0,1fr)_auto] items-center gap-3 rounded-2xl border border-line bg-shell px-3 py-3">
                      <img className="h-14 w-14 rounded-2xl border border-line object-cover" src={product.image} alt={product.name} />
                      <div className="min-w-0">
                        <strong className="block truncate text-sm font-bold text-ink-900">{product.name}</strong>
                        <span className="text-sm text-ink-500">${product.price.toFixed(2)}</span>
                      </div>
                      <button
                        type="button"
                        className="rounded-2xl bg-brand-500 px-4 py-2 text-xs font-bold uppercase tracking-[0.08em] text-white transition hover:bg-brand-600"
                        onClick={() => addItem(product)}
                      >
                        Agregar
                      </button>
                    </article>
                  ))}
                </div>
              </section>
            </section>

            <aside className="space-y-5">
              <div className="rounded-[28px] bg-white px-5 py-6 shadow-soft">
                <h2 className="font-display text-2xl font-bold text-ink-900">Resumen</h2>
                <div className="mt-5 space-y-3 text-sm text-ink-700">
                  <div className="flex items-center justify-between">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Envio</span>
                    <span>{items.length > 0 ? 'Gratis' : '$0.00'}</span>
                  </div>
                  <div className="flex items-center justify-between border-t border-line pt-3 font-display text-2xl font-extrabold text-brand-600">
                    <span>Total</span>
                    <span>${totalFinal.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="rounded-[28px] bg-white px-5 py-6 shadow-soft">
                <h3 className="font-display text-xl font-bold text-ink-900">Estado del flujo</h3>
                <div className="mt-4 space-y-2 text-sm text-ink-700">
                  <p>1. Carrito</p>
                  <p>2. Datos de envio y pago</p>
                  <p>3. Confirmacion final</p>
                </div>
              </div>
            </aside>
          </div>
        </main>

        <footer className="border-t border-line/80 px-6 py-6 text-center text-sm text-ink-500 md:px-8">
          © 2026 Vibra Shop · Sprint 4 Checkout y confirmacion
        </footer>
      </div>
    </div>
  )
}

export default CartPage
