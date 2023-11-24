import express from 'express'
import indexRoutes from './routes/index.routes.js'
import foodRoutes from './routes/food.routes.js'

const app = express()

app.use(express.json())

app.listen(3000)

app.use(indexRoutes)
app.use('/api', foodRoutes)

console.log('working')
