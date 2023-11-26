import { Router } from 'express'
import {
  getRecipes,
  getAvailableRecipes,
  getRecipe,
  getRandomRecipe,
  createRecipe,
  useRecipe,
  updateRecipe,
  deleteRecipe,
} from '../controllers/recipe.controllers.js'

const router = Router()

router.get('/recipe', getRecipes)
router.get('/recipe/available', getAvailableRecipes)
router.get('/recipe/random', getRandomRecipe)
router.get('/recipe/:id', getRecipe)

router.post('/recipe', createRecipe)
router.post('/recipe/:id', useRecipe)

router.patch('/recipe/:id', updateRecipe)

router.delete('/recipe/:id', deleteRecipe)

export default router
