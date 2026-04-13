import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Crear usuario de prueba
  const user = await prisma.user.upsert({
    where: { email: 'cliente@test.com' },
    update: {},
    create: {
      name: 'Cliente Demo',
      email: 'cliente@test.com',
      password: '123456',
      role: 'CLIENT',
    },
  })

  // Crear productos de prueba
  await prisma.product.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      name: 'Camiseta Oversize',
      price: 45000,
      description: 'Camiseta estilo urbano',
      image: 'https://placehold.co/80x80',
    },
  })

  await prisma.product.upsert({
    where: { id: 2 },
    update: {},
    create: {
      id: 2,
      name: 'Jogger Cargo',
      price: 89000,
      description: 'Pantalón cargo juvenil',
      image: 'https://placehold.co/80x80',
    },
  })

  console.log('✅ Seed completado. Usuario id:', user.id)
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })