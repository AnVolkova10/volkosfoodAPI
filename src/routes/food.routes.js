import { Router } from 'express'
import {
  getFoods,
  getFood,
  createFood,
  updateFood,
  deleteFood,
} from '../controllers/food.controllers.js'

const router = Router()

router.get('/food', getFoods)
router.get('/food/:id', getFood)

router.post('/food', createFood)

router.patch('/food/:id', updateFood)

router.delete('/food/:id', deleteFood)

export default router
