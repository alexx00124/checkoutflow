import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import orderRoutes from './routes/order.routes'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

app.use('/api/orders', orderRoutes)

app.get('/', (req, res) => {
  res.json({ message: 'Servidor del Grupo 4 funcionando ✅' })
})

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`)
})