import MainLayout from './layouts/MainLayout'
import Card from './components/ui/Card'
import Input from './components/ui/Input'
import Button from './components/ui/Button'
import './App.css'

function App() {
  return (
    <MainLayout>
      <section className="home-hero">
        <p className="home-hero__kicker">Sprint 4 · Checkout</p>
        <h1>CheckoutFlow esta listo para construir</h1>
        <p className="home-hero__text">
          Ya no estas viendo el template de Vite. Esta pantalla usa tu layout y
          componentes base para arrancar el flujo de checkout.
        </p>
      </section>

      <section className="home-grid">
        <Card title="Estado del proyecto">
          <ul className="home-list">
            <li>UI base disponible</li>
            <li>Theme centralizado en src/theme/index.css</li>
            <li>Siguiente paso: rutas /cart, /checkout, /confirmation</li>
          </ul>
        </Card>

        <Card title="Demo de componentes">
          <div className="home-form">
            <Input label="Correo" placeholder="correo@ejemplo.com" type="email" />
            <Button fullWidth>Continuar al checkout</Button>
          </div>
        </Card>
      </section>
    </MainLayout>
  )
}

export default App
