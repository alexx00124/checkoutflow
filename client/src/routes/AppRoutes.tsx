import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import CartPage from '../pages/CartPage'
import CheckoutPage from '../pages/CheckoutPage'
import ConfirmationPage from '../pages/ConfirmationPage'

const AppRoutes = () => {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="/" element={<Navigate to="/cart" replace />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/confirmation" element={<ConfirmationPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes
