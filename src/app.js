import express from 'express'
import cors from 'cors'
import indexRoutes from './routes/index.routes.js'
import foodRoutes from './routes/food.routes.js'
import recipeRoutes from './routes/recipe.routes.js'

const app = express()

app.use(cors())

app.use(express.json())

app.use(indexRoutes)
app.use(foodRoutes)
app.use(recipeRoutes)
app.use((req, res, next) => {
  res.status(404).json({ message: 'Endpoint not found' })
})

export default app
