import { Request, Response } from 'express'
import prisma from '../config/prisma'

export const createOrder = async (req: Request, res: Response) => {
  try {
    const { userId, name, email, address, city, country, postalCode, phone, paymentMethod, items } = req.body

    if (!Array.isArray(items) || items.length === 0) {
      res.status(400).json({ success: false, message: 'La orden debe incluir productos' })
      return
    }

    if (!name || !email || !address || !city || !country || !postalCode || !phone || !paymentMethod) {
      res.status(400).json({ success: false, message: 'Faltan datos obligatorios de la orden' })
      return
    }

    const total = items.reduce(
      (sum: number, item: { price: number; quantity: number }) =>
        sum + item.price * item.quantity, 0
    )

    const resolvedUserId = userId
      ? userId
      : (
          await prisma.user.upsert({
            where: { email },
            update: { name },
            create: {
              name,
              email,
              password: 'checkout-guest',
              role: 'CLIENT',
            },
          })
        ).id

    await Promise.all(
      items.map(
        (item: {
          productId: number
          price: number
          name?: string
          image?: string
          description?: string
        }) =>
          prisma.product.upsert({
            where: { id: item.productId },
            update: {
              price: item.price,
            },
            create: {
              id: item.productId,
              name: item.name || `Producto ${item.productId}`,
              price: item.price,
              description: item.description || 'Producto agregado desde checkout',
              image: item.image || 'https://placehold.co/100x100',
            },
          }),
      ),
    )

    const order = await prisma.order.create({
      data: {
        userId: resolvedUserId,
        name,
        address,
        city,
        country,
        postalCode,
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
