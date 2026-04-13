import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useCart } from '../hooks/useCart'
import CartPage from '../pages/CartPage'
import CheckoutPage from '../pages/CheckoutPage'
import ConfirmationPage from '../pages/ConfirmationPage'

const ProtectedCheckout = () => {
  const { items } = useCart()
  if (items.length === 0) return <Navigate to="/cart" replace />
  return <CheckoutPage />
}

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/cart" replace />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<ProtectedCheckout />} />
        <Route path="/confirmation" element={<ConfirmationPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes