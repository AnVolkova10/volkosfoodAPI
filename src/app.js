import express from 'express'
import indexRoutes from './routes/index.routes.js'
import foodRoutes from './routes/food.routes.js'

const app = express()

app.use(express.json())

app.use(indexRoutes)
app.use('/api', foodRoutes)
app.use((req, res, next) => {
  res.status(404).json({ message: 'Endpoint not found' })
})

export default app
