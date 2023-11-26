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

export async function createRecipeTable() {
  const [rows, fields] = await pool.query(`
    CREATE TABLE IF NOT EXISTS recipe (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      ingredients TEXT,
      accesories TEXT,
      meals VARCHAR(255) NOT NULL,
      image VARCHAR(255),
      difficulty INT NOT NULL,
      steps TEXT,
      duration VARCHAR(255) NOT NULL,
      taste VARCHAR(255) NOT NULL,
      quantity INT,
      healthy BOOLEAN NOT NULL,
      rating INT NOT NULL
    );
  `)
  return rows
}

export async function createFoodTable() {
  const [rows, fields] = await pool.query(`
    CREATE TABLE IF NOT EXISTS food (
      id INT(11) NOT NULL AUTO_INCREMENT,
      name VARCHAR(45) NOT NULL,
      image VARCHAR(300),
      quantity INT(100) NOT NULL,
      market VARCHAR(20) NOT NULL,
      storage VARCHAR(20) NOT NULL,
      type VARCHAR(20) NOT NULL,
      taste VARCHAR(20) NOT NULL,
      healthy BOOLEAN NOT NULL,
      few_left BOOLEAN NOT NULL,
      due_date DATE,
      market_limit INT(10) NOT NULL,
      diet_limit INT(10),
      PRIMARY KEY (id)
    );
  `)
  return rows
}
export async function createRecipeIngredientTable() {
  const [rows, fields] = await pool.query(`
    CREATE TABLE IF NOT EXISTS recipe_ingredient (
      recipe_id INT,
      ingredient_id INT,
      quantity INT,
      FOREIGN KEY (recipe_id) REFERENCES recipe(id),
      FOREIGN KEY (ingredient_id) REFERENCES food(id)
    );
  `)
  return rows
}

export async function createShoppingListTable() {
  const [rows, fields] = await pool.query(`
    CREATE TABLE IF NOT EXISTS shopping_list (
      id INT AUTO_INCREMENT PRIMARY KEY,
      food_id INT,
      quantity INT,
      FOREIGN KEY (food_id) REFERENCES food(id)
    );
  `)
  return rows
}
