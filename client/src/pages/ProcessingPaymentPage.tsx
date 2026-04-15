import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCheckoutState } from '../context/CheckoutContext'

const ProcessingPaymentPage = () => {
  const navigate = useNavigate()
  const { lastOrder } = useCheckoutState()
  const [progress, setProgress] = useState(12)
  const [stage, setStage] = useState('Validando metodo de pago...')

  useEffect(() => {
    if (!lastOrder) {
      navigate('/cart', { replace: true })
      return
    }

    const progressTimer = window.setInterval(() => {
      setProgress((current) => {
        if (current >= 92) {
          return current
        }

        return current + 8
      })
    }, 180)

    const stageOne = window.setTimeout(() => {
      setStage('Confirmando disponibilidad de inventario...')
    }, 700)

    const stageTwo = window.setTimeout(() => {
      setStage('Generando la aprobacion segura de la compra...')
    }, 1400)

    const timer = window.setTimeout(() => {
      navigate('/purchase-alert', { replace: true })
    }, 1800)

    return () => {
      window.clearInterval(progressTimer)
      window.clearTimeout(stageOne)
      window.clearTimeout(stageTwo)
      window.clearTimeout(timer)
    }
  }, [lastOrder, navigate])

  return (
    <div className="min-h-screen px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-4xl overflow-hidden rounded-[32px] border border-white/70 bg-white/50 shadow-soft backdrop-blur">
        <header className="flex items-center justify-between border-b border-line/80 px-6 py-4 md:px-8">
          <span className="font-display text-lg font-extrabold uppercase tracking-[0.12em] text-brand-600">
            Vibra Shop
          </span>
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-ink-500">
            Procesando pago
          </span>
        </header>

        <main className="px-6 py-16 md:px-8">
          <div className="rounded-[28px] bg-white px-6 py-14 text-center shadow-soft">
            <div className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-brand-100 border-t-brand-500" />
            <h1 className="mt-8 font-display text-4xl font-bold tracking-[-0.04em] text-ink-900">
              Estamos procesando tu compra
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-ink-700">
              {stage}
            </p>
            <div className="mx-auto mt-8 max-w-xl">
              <div className="h-3 overflow-hidden rounded-full bg-brand-100">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-brand-400 to-brand-600 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="mt-3 flex items-center justify-between text-xs font-medium uppercase tracking-[0.12em] text-ink-500">
                <span>Preparando orden</span>
                <span>{progress}%</span>
              </div>
            </div>
            <div className="mx-auto mt-6 grid max-w-xl gap-3 text-left md:grid-cols-3">
              <div className="rounded-2xl border border-line bg-shell px-4 py-3 text-sm text-ink-700">Pago verificado</div>
              <div className="rounded-2xl border border-line bg-shell px-4 py-3 text-sm text-ink-700">Stock reservado</div>
              <div className="rounded-2xl border border-line bg-shell px-4 py-3 text-sm text-ink-700">Orden en proceso</div>
            </div>
            <div className="mx-auto mt-8 max-w-md rounded-2xl border border-dashed border-brand-300 bg-brand-50 px-5 py-4 text-sm text-brand-700">
              No cierres esta ventana. Te llevaremos automaticamente al siguiente paso.
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default ProcessingPaymentPage
