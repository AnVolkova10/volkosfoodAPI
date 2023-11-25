import { Router } from 'express'
import { getRecipes } from '../controllers/recipe.controllers.js'

const router = Router()

router.get('/recipe', getRecipes)

export default router
