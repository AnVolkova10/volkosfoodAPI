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

export const getAvailableRecipes = async (req, res) => {
  try {
    const query = `
      SELECT DISTINCT recipe.*
      FROM recipe
      JOIN recipe_ingredient ON recipe.id = recipe_ingredient.recipe_id
      JOIN food ON recipe_ingredient.ingredient_id = food.id
      GROUP BY recipe.id
      HAVING MIN(food.quantity >= recipe_ingredient.quantity)
    `

    const [rows] = await pool.query(query)

    if (rows.length <= 0)
      return res
        .status(404)
        .json({ message: 'No recipes found with available ingredients' })

    res.json(rows)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Algo salió mal' })
  }
}

export const getRecipe = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM recipe WHERE id = ?', [
      req.params.id,
    ])

    if (rows.length <= 0)
      return res.status(404).json({ message: 'recipe not found' })

    res.json(rows[0])
  } catch (error) {
    return res.status(500).json({ message: 'algo fue mal' })
  }
}

export const getRandomRecipe = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT recipe.*
      FROM recipe
      JOIN recipe_ingredient ON recipe.id = recipe_ingredient.recipe_id
      LEFT JOIN food ON recipe_ingredient.ingredient_id = food.id
      GROUP BY recipe.id
      HAVING MIN(food.quantity >= recipe_ingredient.quantity)
      ORDER BY RAND()
      LIMIT 1;
    `)

    if (rows.length <= 0)
      return res
        .status(404)
        .json({ message: 'No recipes found with available ingredients' })

    res.json(rows[0])
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Algo salió mal' })
  }
}

export const createRecipe = async (req, res) => {
  const {
    name,
    ingredients,
    accesories,
    meals,
    image,
    difficulty,
    steps,
    duration,
    taste,
    quantity,
    healthy,
    rating,
  } = req.body

  const values = [
    name,
    '',
    accesories,
    meals,
    image,
    difficulty,
    steps,
    duration,
    taste,
    quantity,
    healthy,
    rating,
  ]

  const ingredientDetailsQuery = `
    SELECT food.name, recipe_ingredient.quantity 
    FROM food
    JOIN recipe_ingredient ON food.id = recipe_ingredient.ingredient_id
    WHERE recipe_ingredient.recipe_id = ?
  `

  const query = `
    INSERT INTO recipe 
    (name, ingredients, accesories, meals, image, difficulty, steps, duration, taste, quantity, healthy, rating) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `
  try {
    const [rows] = await pool.query(query, values)
    const recipeId = rows.insertId

    for (let ingredient of ingredients) {
      const ingredientQuery = `INSERT INTO recipe_ingredient (recipe_id, ingredient_id, quantity) VALUES (?, ?, ?)`
      const ingredientValues = [recipeId, ingredient.id, ingredient.quantity]
      await pool.query(ingredientQuery, ingredientValues)
    }

    const [ingredientDetails] = await pool.query(ingredientDetailsQuery, [
      recipeId,
    ])
    const ingredientNamesString = ingredientDetails
      .map((ingredient) => `${ingredient.name}: ${ingredient.quantity}`)
      .join(', ')

    const updateRecipeQuery = `
      UPDATE recipe 
      SET ingredients = ? 
      WHERE id = ?
    `
    await pool.query(updateRecipeQuery, [ingredientNamesString, recipeId])

    res.send({
      id: recipeId,
      name,
      accesories,
      meals,
      image,
      difficulty,
      steps,
      duration,
      taste,
      quantity,
      healthy,
      rating,
      ingredients: ingredientNamesString,
    })
  } catch (error) {
    console.error(error)
    res
      .status(500)
      .send({ error: 'An error occurred while creating the recipe' })
  }
}

export const useRecipe = async (req, res) => {
  const recipeId = req.params.id

  try {
    const [recipeRows] = await pool.query('SELECT * FROM recipe WHERE id = ?', [
      recipeId,
    ])
    const [ingredientRows] = await pool.query(
      'SELECT * FROM recipe_ingredient WHERE recipe_id = ?',
      [recipeId]
    )

    if (recipeRows.length <= 0) {
      return res.status(404).json({ message: 'Recipe not found' })
    }

    for (let ingredient of ingredientRows) {
      const [foodRow] = await pool.query('SELECT * FROM food WHERE id = ?', [
        ingredient.ingredient_id,
      ])

      if (foodRow.length <= 0 || foodRow[0].quantity < ingredient.quantity) {
        return res
          .status(400)
          .json({ message: 'Insufficient quantity of ingredients' })
      }
    }

    for (let ingredient of ingredientRows) {
      const updatedQuantity = ingredient.quantity

      await pool.query('UPDATE food SET quantity = quantity - ? WHERE id = ?', [
        updatedQuantity,
        ingredient.ingredient_id,
      ])

      const [updatedFood] = await pool.query(
        'SELECT * FROM food WHERE id = ?',
        [ingredient.ingredient_id]
      )

      if (
        updatedFood.length > 0 &&
        (updatedFood[0].quantity <= updatedFood[0].market_limit ||
          updatedFood[0].few_left === true)
      ) {
        const [existingFood] = await pool.query(
          'SELECT * FROM shopping_list WHERE food_id = ?',
          [ingredient.ingredient_id]
        )

        if (existingFood.length === 0) {
          await pool.query('INSERT INTO shopping_list (food_id) VALUES (?)', [
            ingredient.ingredient_id,
          ])
        }
      }
    }

    res.json({ message: 'Recipe used successfully' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Something went wrong' })
  }
}

export const updateRecipe = async (req, res) => {
  const { id } = req.params
  const {
    name,
    ingredients,
    accesories,
    meals,
    image,
    difficulty,
    steps,
    duration,
    taste,
    quantity,
    healthy,
    rating,
  } = req.body

  const query = `
    UPDATE recipe 
    SET 
      name = IFNULL(?, name),
      accesories = IFNULL(?, accesories),
      meals = IFNULL(?, meals),
      image = IFNULL(?, image),
      difficulty = IFNULL(?, difficulty),
      steps = IFNULL(?, steps),
      duration = IFNULL(?, duration),
      taste = IFNULL(?, taste),
      quantity = IFNULL(?, quantity),
      healthy = IFNULL(?, healthy),
      rating = IFNULL(?, rating)
    WHERE id = ?
  `

  try {
    const [result] = await pool.query(query, [
      name,
      accesories,
      meals,
      image,
      difficulty,
      steps,
      duration,
      taste,
      quantity,
      healthy,
      rating,
      id,
    ])

    if (result.affectedRows <= 0)
      return res.status(404).json({ message: 'Recipe not found' })

    if (ingredients && ingredients.length > 0) {
      const deleteIngredientsQuery =
        'DELETE FROM recipe_ingredient WHERE recipe_id = ?'
      await pool.query(deleteIngredientsQuery, [id])

      for (let ingredient of ingredients) {
        const ingredientQuery =
          'INSERT INTO recipe_ingredient (recipe_id, ingredient_id, quantity) VALUES (?, ?, ?)'
        const ingredientValues = [id, ingredient.id, ingredient.quantity]
        await pool.query(ingredientQuery, ingredientValues)
      }

      const ingredientDetailsQuery = `
        SELECT food.name, recipe_ingredient.quantity 
        FROM food
        JOIN recipe_ingredient ON food.id = recipe_ingredient.ingredient_id
        WHERE recipe_ingredient.recipe_id = ?
      `
      const [ingredientDetails] = await pool.query(ingredientDetailsQuery, [id])
      const ingredientNamesString = ingredientDetails
        .map((ingredient) => `${ingredient.name}: ${ingredient.quantity}`)
        .join(', ')

      const updateRecipeQuery = `
        UPDATE recipe 
        SET ingredients = ? 
        WHERE id = ?
      `
      await pool.query(updateRecipeQuery, [ingredientNamesString, id])
    }

    const [rows] = await pool.query('SELECT * FROM recipe WHERE id = ?', [id])

    res.json(rows[0])
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Something went wrong' })
  }
}

export const deleteRecipe = async (req, res) => {
  try {
    const recipeId = req.params.id

    await pool.query('DELETE FROM recipe_ingredient WHERE recipe_id = ?', [
      recipeId,
    ])

    const [result] = await pool.query('DELETE FROM recipe WHERE id = ?', [
      recipeId,
    ])

    if (result.affectedRows <= 0)
      return res.status(404).json({ message: 'recipe not found' })

    res.sendStatus(204)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'algo fue mal' })
  }
}
