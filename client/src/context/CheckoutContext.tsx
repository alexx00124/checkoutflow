import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import type { FormData } from '../components/checkout/OrderForm'
import type { CompletedOrder } from '../types'

interface CheckoutContextType {
  formData: FormData | null
  setFormData: (data: FormData | null) => void
  isFormValid: boolean
  setIsFormValid: (valid: boolean) => void
  coupon: string
  setCoupon: (code: string) => void
  couponApplied: boolean
  setCouponApplied: (applied: boolean) => void
  lastOrder: CompletedOrder | null
  setLastOrder: (order: CompletedOrder | null) => void
  resetCheckout: () => void
}

const CheckoutContext = createContext<CheckoutContextType | undefined>(undefined)

const STORAGE_KEY = 'vibra_checkout_data'

interface StoredCheckoutState {
  formData: FormData | null
  isFormValid: boolean
  coupon: string
  couponApplied: boolean
  lastOrder: CompletedOrder | null
}

const defaultState: StoredCheckoutState = {
  formData: null,
  isFormValid: false,
  coupon: '',
  couponApplied: false,
  lastOrder: null,
}

export function CheckoutProvider({ children }: { children: ReactNode }) {
  const [formData, setFormDataState] = useState<FormData | null>(null)
  const [isFormValid, setIsFormValid] = useState(false)
  const [coupon, setCoupon] = useState('')
  const [couponApplied, setCouponApplied] = useState(false)
  const [lastOrder, setLastOrderState] = useState<CompletedOrder | null>(null)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as StoredCheckoutState
        setFormDataState(parsed.formData || defaultState.formData)
        setIsFormValid(parsed.isFormValid || defaultState.isFormValid)
        setCoupon(parsed.coupon || defaultState.coupon)
        setCouponApplied(parsed.couponApplied || defaultState.couponApplied)
        setLastOrderState(parsed.lastOrder || defaultState.lastOrder)
      } catch {}
    }

    setIsReady(true)
  }, [])

  useEffect(() => {
    if (!isReady) {
      return
    }

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        formData,
        isFormValid,
        coupon,
        couponApplied,
        lastOrder,
      }),
    )
  }, [formData, isFormValid, coupon, couponApplied, lastOrder, isReady])

  const setFormData = (data: FormData | null) => {
    setFormDataState(data)
  }

  const handleSetIsFormValid = (valid: boolean) => {
    setIsFormValid(valid)
  }

  const handleSetCoupon = (code: string) => {
    setCoupon(code)
  }

  const handleSetCouponApplied = (applied: boolean) => {
    setCouponApplied(applied)
  }

  const setLastOrder = (order: CompletedOrder | null) => {
    setLastOrderState(order)
  }

  const resetCheckout = () => {
    setFormDataState(null)
    setIsFormValid(false)
    setCoupon('')
    setCouponApplied(false)
  }

  return (
    <CheckoutContext.Provider value={{
      formData, setFormData,
      isFormValid, setIsFormValid: handleSetIsFormValid,
      coupon, setCoupon: handleSetCoupon,
      couponApplied, setCouponApplied: handleSetCouponApplied,
      lastOrder, setLastOrder,
      resetCheckout,
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
