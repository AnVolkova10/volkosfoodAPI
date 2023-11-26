import { Router } from 'express'
import {
  getRecipes,
  getRecipe,
  getRandomRecipe,
  createRecipe,
  updateRecipe,
  deleteRecipe,
} from '../controllers/recipe.controllers.js'

const router = Router()

router.get('/recipe', getRecipes)
router.get('/recipe/random', getRandomRecipe)
router.get('/recipe/:id', getRecipe)

router.post('/recipe', createRecipe)

router.patch('/recipe/:id', updateRecipe)

router.delete('/recipe/:id', deleteRecipe)

export default router
