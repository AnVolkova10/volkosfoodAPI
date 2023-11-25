import { pool } from '../db.js'

export const getRecipes = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM recipe')
    res.json(rows)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'algo fue mal' })
  }
}
