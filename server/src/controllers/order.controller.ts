import { Request, Response } from 'express'
import prisma from '../config/prisma'

export const createOrder = async (req: Request, res: Response) => {
  try {
    const { userId, name, address, city, phone, paymentMethod, items } = req.body

    const total = items.reduce(
      (sum: number, item: { price: number; quantity: number }) =>
        sum + item.price * item.quantity, 0
    )

    const order = await prisma.order.create({
      data: {
        userId,
        name,
        address,
        city,
        phone,
        paymentMethod,
        total,
        status: 'pendiente',
        items: {
          create: items.map((item: { productId: number; quantity: number; price: number }) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: { items: true },
    })

    res.status(201).json({ success: true, order })
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, message: 'Error al crear la orden' })
  }
}

export const getOrders = async (req: Request, res: Response) => {
  try {
    const orders = await prisma.order.findMany({
      include: { items: true, user: true },
    })
    res.json({ success: true, orders })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al obtener órdenes' })
  }
}