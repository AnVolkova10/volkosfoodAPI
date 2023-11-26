import app from './app.js'
import { PORT } from './config.js'
import {
  createRecipeTable,
  createFoodTable,
  createRecipeIngredientTable,
  createShoppingListTable,
} from './db.js'

createRecipeTable()
  .then(() => {
    createFoodTable()
      .then(() => {
        createRecipeIngredientTable()
          .then(() => {
            createShoppingListTable()
              .then(() => {
                app.listen(PORT)
                console.log('Running on', PORT)
              })
              .catch((err) => {
                console.error('Error creating shopping_list table', err)
              })
          })
          .catch((err) => {
            console.error('Error creating recipe_ingredient table', err)
          })
      })
      .catch((err) => {
        console.error('Error creating food table', err)
      })
  })
  .catch((err) => {
    console.error('Error creating recipe table', err)
  })
