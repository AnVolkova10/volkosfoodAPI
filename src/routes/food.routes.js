import { Router } from 'express'
import {
  getFood,
  createFood,
  updateFood,
  deleteFood,
} from '../controllers/food.controllers.js'

const router = Router()

router.get('/food', getFood)

router.post('/food', createFood)

router.put('/food', updateFood)

router.delete('/food', deleteFood)

export default router
