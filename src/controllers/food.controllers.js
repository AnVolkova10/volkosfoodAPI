import { pool } from '../db.js'

export const getFoods = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM food')
    res.json(rows)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'algo fue mal' })
  }
}

export const getAvailableFoods = async (req, res) => {
  try {
    const query = 'SELECT * FROM food WHERE quantity > 0'
    const [rows] = await pool.query(query)
    res.json(rows)
  } catch (error) {
    console.error(error)
    return res
      .status(500)
      .json({ message: 'Algo salió mal al obtener los alimentos disponibles' })
  }
}

export const getFood = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM food WHERE id = ?', [
      req.params.id,
    ])

    if (rows.length <= 0)
      return res.status(404).json({ message: 'food not found' })

    res.json(rows[0])
  } catch (error) {
    return res.status(500).json({ message: 'algo fue mal' })
  }
}

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
  } catch (error) {
    console.error(error)
    res.status(500).send({ error: 'An error occurred while creating the food' })
  }
}

export const updateFood = async (req, res) => {
  const { id } = req.params
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

  const query = `UPDATE food SET name = IFNULL(?, name), type = IFNULL(?, type), image = IFNULL(?, image), quantity = IFNULL(?, quantity), market = IFNULL(?, market), storage = IFNULL(?, storage), taste = IFNULL(?, taste), healthy = IFNULL(?, healthy), few_left = IFNULL(?, few_left), due_date = IFNULL(?, due_date), market_limit = IFNULL(?, market_limit), diet_limit = IFNULL(?, diet_limit) WHERE id = ?`

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
    id,
  ]

  try {
    const [result] = await pool.query(query, values)

    if (result.affectedRows <= 0)
      return res.status(404).json({ message: 'food not found' })

    const [rows] = await pool.query('SELECT * FROM food WHERE id = ?', [id])

    res.json(rows[0])
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'algo fue mal' })
  }
}

export const deleteFood = async (req, res) => {
  try {
    const foodId = req.params.id

    const [ingredientRows] = await pool.query(
      'SELECT * FROM recipe_ingredient WHERE ingredient_id = ? LIMIT 1',
      [foodId]
    )

    if (ingredientRows.length > 0) {
      return res.status(400).json({ message: 'This food is used in a recipe' })
    }

    const [result] = await pool.query('DELETE FROM food WHERE id = ?', [foodId])

    if (result.affectedRows <= 0) {
      return res.status(404).json({ message: 'Food not found' })
    }

    res.sendStatus(204)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Something went wrong' })
  }
}
