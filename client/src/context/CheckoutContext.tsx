import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import type { FormData } from '../components/checkout/OrderForm'

interface CheckoutContextType {
  formData: FormData | null
  setFormData: (data: FormData | null) => void
  isFormValid: boolean
  setIsFormValid: (valid: boolean) => void
  coupon: string
  setCoupon: (code: string) => void
  couponApplied: boolean
  setCouponApplied: (applied: boolean) => void
}

const CheckoutContext = createContext<CheckoutContextType | undefined>(undefined)

const STORAGE_KEY = 'vibra_checkout_data'

export function CheckoutProvider({ children }: { children: ReactNode }) {
  const [formData, setFormDataState] = useState<FormData | null>(null)
  const [isFormValid, setIsFormValid] = useState(false)
  const [coupon, setCoupon] = useState('')
  const [couponApplied, setCouponApplied] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (parsed.formData) {
          setFormDataState(parsed.formData)
          setIsFormValid(parsed.isFormValid || false)
          setCoupon(parsed.coupon || '')
          setCouponApplied(parsed.couponApplied || false)
        }
      } catch {}
    }
  }, [])

  const setFormData = (data: FormData | null) => {
    setFormDataState(data)
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      formData: data,
      isFormValid,
      coupon,
      couponApplied
    }))
  }

  const handleSetIsFormValid = (valid: boolean) => {
    setIsFormValid(valid)
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      formData,
      isFormValid: valid,
      coupon,
      couponApplied
    }))
  }

  const handleSetCoupon = (code: string) => {
    setCoupon(code)
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      formData,
      isFormValid,
      coupon: code,
      couponApplied
    }))
  }

  const handleSetCouponApplied = (applied: boolean) => {
    setCouponApplied(applied)
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      formData,
      isFormValid,
      coupon,
      couponApplied: applied
    }))
  }

  return (
    <CheckoutContext.Provider value={{
      formData, setFormData,
      isFormValid, setIsFormValid: handleSetIsFormValid,
      coupon, setCoupon: handleSetCoupon,
      couponApplied, setCouponApplied: handleSetCouponApplied
    }}>
      {children}
    </CheckoutContext.Provider>
  )
}

export function useCheckoutState() {
  const context = useContext(CheckoutContext)
  if (!context) {
    throw new Error('useCheckoutState must be used within CheckoutProvider')
  }
  return context
}

export function clearCheckoutData() {
  localStorage.removeItem(STORAGE_KEY)
}