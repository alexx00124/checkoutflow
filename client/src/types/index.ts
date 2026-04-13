export interface Product {
  id: number
  name: string
  price: number
  image: string
  description: string
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface OrderFormData {
  name: string
  address: string
  city: string
  phone: string
  email: string
  paymentMethod: string
}

export interface Order {
  id: number
  total: number
  status: string
  items: CartItem[]
}