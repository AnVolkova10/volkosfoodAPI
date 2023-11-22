import { pool } from '../db.js'

export const getFood = (req, res) => res.send('obteniendo comidas')

export const createFood = async (req, res) => {
  const {
    name,
    type,
    image,
    quantity,
    market,
    storage,
    taste,
    healthy,
    few_left,
    due_date,
    market_limit,
    diet_limit,
  } = req.body

  const query = `INSERT INTO food (name, type, image, quantity, market, storage, taste, healthy, few_left, due_date, market_limit, diet_limit) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`

  const values = [
    name,
    type,
    image,
    quantity,
    market,
    storage,
    taste,
    healthy,
    few_left,
    due_date,
    market_limit,
    diet_limit,
  ]

  try {
    const [rows] = await pool.query(query, values)
    res.send({
      id: rows.insertId,
      name,
      type,
      image,
      quantity,
      market,
      storage,
      taste,
      healthy,
      few_left,
      due_date,
      market_limit,
      diet_limit,
    })
  } catch (err) {
    console.error(err)
    res.status(500).send({ error: 'An error occurred while creating the food' })
  }
}
export const updateFood = (req, res) => res.send('actulizando comida')

export const deleteFood = (req, res) => res.send('borrando comida')
