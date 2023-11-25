import { createPool } from 'mysql2/promise'
import {
  DB_HOST,
  DB_PORT,
  DB_USER,
  DB_PASSWORD,
  DB_DATABASE,
} from './config.js'

export const pool = createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  port: DB_PORT,
  database: DB_DATABASE,
})

export async function createRecipeIngredientTable() {
  const [rows, fields] = await pool.query(`
    CREATE TABLE recipe_ingredient (
      recipe_id INT,
      ingredient_id INT,
      quantity INT,
      FOREIGN KEY (recipe_id) REFERENCES recipe(id),
      FOREIGN KEY (ingredient_id) REFERENCES food(id)
    );
  `)
  return rows
}
