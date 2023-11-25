import app from './app.js'
import { PORT } from './config.js'
import { createRecipeIngredientTable } from './db.js'

// app.listen(PORT)
// console.log('running on', PORT)

createRecipeIngredientTable()
  .then(() => {
    app.listen(PORT)
    console.log('running on', PORT)
  })
  .catch((err) => {
    console.error('Error creating recipe_ingredient table', err)
  })
