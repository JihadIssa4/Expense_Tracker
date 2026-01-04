const express = require("express");
const router = express.Router();
const db = require("../config/db");
const middleware = require("../middleware/authmiddleware");

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: API endpoints for managing expense categories
 */

/**
 * @swagger
 * /api/categories/addCategory:
 *   post:
 *     summary: Add a new expense category
 *     description: Adds a new category for the authenticated user.
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - expected_amount
 *             properties:
 *               name:
 *                 type: string
 *                 example: Food
 *               expected_amount:
 *                 type: number
 *                 example: 300
 *     responses:
 *       201:
 *         description: Category created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 name:
 *                   type: string
 *                   example: Food
 *                 amount:
 *                   type: number
 *                   example: 300
 *       500:
 *         description: Error inserting data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Error inserting data
 */
router.post("/addCategory", middleware, (req, res) => {
  const userId = req.userId;
  const name = req.body.name;
  const amount = req.body.expected_amount;

  db.run(
    "INSERT INTO expense_categories (name, expected_amount, user_id) VALUES (?, ?, ?)",
    [name, amount, userId],
    (err) => {
      if (err) {
        console.error("Inserting failed");
        return res.status(500).json({ error: "Error inserting data" });
      }
      return res.status(201).json({
        category_id: this.lastId,
        user_id: userId,
        name: name,
        amount: amount,
      });
    }
  );
});

/**
 * @swagger
 * /api/categories/allCategories:
 *   get:
 *     summary: Get all categories for the authenticated user
 *     description: Returns all categories with expected amount and actual amount spent.
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of categories retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                   example: 3
 *                 categories:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 5
 *                       name:
 *                         type: string
 *                         example: Food
 *                       expected_amount:
 *                         type: number
 *                         example: 300
 *                       actual_spent:
 *                         type: number
 *                         example: 150
 *       500:
 *         description: Database error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Database error
 */
router.get("/allCategories", middleware, (req, res) => {
  const userId = req.userId;

  const query = `
        SELECT expense_categories.id,
               expense_categories.name,
               expense_categories.expected_amount,
               COALESCE(SUM(expenses.amount), 0) AS actual_spent
        FROM expense_categories
        LEFT JOIN expenses ON expense_categories.id = expenses.category_id
        WHERE expense_categories.user_id = ?
        GROUP BY expense_categories.id
    `;

  db.all(query, [userId], (err, categories) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Database error" });
    }

    res.json({
      categories: categories,
      count: categories.length,
    });
  });
});

/**
 * @swagger
 * /api/categories/delCategory/{id}:
 *   delete:
 *     summary: Delete a category
 *     description: Deletes a category by ID.
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Category ID to delete
 *     responses:
 *       200:
 *         description: Category deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: string
 *                   example: success
 *       500:
 *         description: Database error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Database error
 */
router.delete("/delCategory/:id", middleware, (req, res) => {
  const id = req.params.id;

  db.run("DELETE FROM expense_categories WHERE id = ?", [id], (err) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Database error" });
    }

    return res.status(200).json({ success: "success" });
  });
});

/**
 * @swagger
 * /api/categories/updateCategory/{id}:
 *   put:
 *     summary: Update an expense category
 *     description: Updates a category name and expected amount for the authenticated user.
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Category ID to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - expected_amount
 *             properties:
 *               name:
 *                 type: string
 *                 example: Groceries
 *               expected_amount:
 *                 type: number
 *                 example: 400
 *     responses:
 *       200:
 *         description: Category updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: string
 *                   example: success
 *       404:
 *         description: Category not found
 *       500:
 *         description: Database error
 */
router.put("/updateCategory/:id", middleware, (req, res) => {
  const userId = req.userId;
  const categoryId = req.params.id;
  const { name, expected_amount } = req.body;

  if (!name || expected_amount <= 0) {
    return res.status(400).json({ error: "Invalid input data" });
  }

  const query = `
    UPDATE expense_categories
    SET name = ?, expected_amount = ?
    WHERE id = ? AND user_id = ?
  `;

  db.run(query, [name, expected_amount, categoryId, userId], function (err) {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Database error" });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: "Category not found" });
    }

    return res.status(200).json({ success: "success" });
  });
});

module.exports = router;
