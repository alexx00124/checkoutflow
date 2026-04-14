export interface Product {
  id: number
  name: string
  price: number
  image: string
  description?: string
  size?: string
  color?: string
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface CheckoutFormData {
  fullName: string
  address: string
  city: string
  postalCode: string
  country: string
  phone: string
  email: string
  paymentMethod: 'tarjeta' | 'paypal'
  cardNumber: string
  cardExpiry: string
  cardCvc: string
}

export interface Order {
  id: number
  total: number
  status: string
  items: CartItem[]
}

export interface CompletedOrder {
  id: string
  createdAt: string
  items: CartItem[]
  subtotal: number
  shipping: number
  discount: number
  total: number
  formData: CheckoutFormData
}
