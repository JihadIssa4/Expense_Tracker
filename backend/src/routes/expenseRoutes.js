const express = require("express");
const router = express.Router();
const db = require("../config/db");
const middleware = require("../middleware/authmiddleware");

/**
 * @swagger
 * tags:
 *   name: Expenses
 *   description: Endpoints for managing user expenses
 */

/**
 * @swagger
 * /api/expenses/addExpense:
 *   post:
 *     summary: Add a new expense for the authenticated user
 *     description: Creates a new expense record linked to the user's category and ID.
 *     tags: [Expenses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - category_id
 *               - amount
 *               - description
 *               - date
 *             properties:
 *               category_id:
 *                 type: integer
 *                 example: 3
 *               amount:
 *                 type: number
 *                 example: 45.50
 *               description:
 *                 type: string
 *                 example: Lunch with friends
 *               date:
 *                 type: string
 *                 format: date
 *                 example: 2025-01-10
 *     responses:
 *       200:
 *         description: Expense created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 expense:
 *                   type: object
 *                   properties:
 *                     category_id:
 *                       type: integer
 *                       example: 3
 *                     amount:
 *                       type: number
 *                       example: 45.50
 *                     description:
 *                       type: string
 *                       example: Lunch with friends
 *                     date:
 *                       type: string
 *                       example: 2025-01-10
 *       404:
 *         description: User not found in expense_categories
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: User not found in expense_categories
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
router.post("/addExpense", middleware, (req, res) => {
  const userId = req.userId;
  const { category_id, amount, description, date } = req.body;

  db.get(
    "SELECT id FROM expense_categories WHERE id = ? AND user_id = ?",
    [category_id, userId],
    (err, row) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "Database error" });
      }

      if (!row) {
        return res.status(403).json({ error: "Unauthorized category access" });
      }

      const query = `
        INSERT INTO expenses (user_id, category_id, amount, description, date)
        VALUES (?, ?, ?, ?, ?)
      `;

      db.run(
        query,
        [userId, category_id, amount, description, date],
        function (err) {
          if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Database error" });
          }

          return res.status(201).json({
            expense: {
              id: this.lastID,
              user_id: userId,
              category_id,
              amount,
              description,
              date,
            },
          });
        }
      );
    }
  );
});

/**
 * @swagger
 * tags:
 *   name: Expenses
 *   description: API endpoints for managing expenses
 */

/**
 * @swagger
 * /api/expenses/allExpenses/{categoryId}:
 *   get:
 *     summary: Get all expenses for a category
 *     description: Retrieves all expenses for the authenticated user under a specific category.
 *     tags: [Expenses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the expense category
 *     responses:
 *       200:
 *         description: List of expenses retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   amount:
 *                     type: number
 *                     example: 50
 *                   description:
 *                     type: string
 *                     example: "Groceries at supermarket"
 *                   date:
 *                     type: string
 *                     format: date
 *                     example: "2025-12-11"
 *       404:
 *         description: User or category not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: User not found in expense_categories
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Database error
 */
router.get("/allExpenses/:categoryId", middleware, (req, res) => {
  const userId = req.userId;
  const { categoryId } = req.params;

  // 1. Verify category ownership
  db.get(
    "SELECT id FROM expense_categories WHERE id = ? AND user_id = ?",
    [categoryId, userId],
    (err, category) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Database error" });
      }

      if (!category) {
        return res.status(403).json({ error: "Unauthorized category access" });
      }

      // 2. Fetch expenses for that category
      db.all(
        "SELECT id, category_id, amount, description, date FROM expenses WHERE category_id = ? AND user_id = ? ORDER BY date DESC",
        [categoryId, userId],
        (err, rows) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ error: "Database error" });
          }

          res.status(200).json(rows);
        }
      );
    }
  );
});

/**
 * @swagger
 * /api/expenses:
 *   get:
 *     summary: Get all expenses for the authenticated user
 *     tags: [Expenses]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user expenses
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   amount:
 *                     type: number
 *                   description:
 *                     type: string
 *                   date:
 *                     type: string
 *                     format: date
 *                   category_id:
 *                     type: integer
 *                   category_name:
 *                     type: string
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Database error
 */
router.get("/", middleware, (req, res) => {
  const userId = req.userId;

  const query = `
    SELECT
      e.id,
      e.amount,
      e.description,
      e.date,
      e.category_id,
      c.name AS category_name
    FROM expenses e
    JOIN expense_categories c ON e.category_id = c.id
    WHERE e.user_id = ?
    ORDER BY e.date DESC
  `;

  db.all(query, [userId], (err, rows) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Database error" });
    }

    res.status(200).json(rows);
  });
});

/**
 * @swagger
 * /api/expenses/{id}:
 *   put:
 *     summary: Update an expense
 *     tags: [Expenses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - category_id
 *               - amount
 *               - description
 *               - date
 *     responses:
 *       200:
 *         description: Expense updated successfully
 *       403:
 *         description: Unauthorized
 *       404:
 *         description: Expense not found
 */
router.put("/:id", middleware, (req, res) => {
  const userId = req.userId;
  const expenseId = req.params.id;
  const { category_id, amount, description, date } = req.body;

  // 1. Verify expense ownership
  db.get(
    "SELECT id FROM expenses WHERE id = ? AND user_id = ?",
    [expenseId, userId],
    (err, expense) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Database error" });
      }

      if (!expense) {
        return res.status(404).json({ error: "Expense not found" });
      }

      // 2. Verify category ownership
      db.get(
        "SELECT id FROM expense_categories WHERE id = ? AND user_id = ?",
        [category_id, userId],
        (err, category) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ error: "Database error" });
          }

          if (!category) {
            return res
              .status(403)
              .json({ error: "Unauthorized category access" });
          }

          // 3. Update expense
          db.run(
            `UPDATE expenses
             SET category_id = ?, amount = ?, description = ?, date = ?
             WHERE id = ? AND user_id = ?`,
            [category_id, amount, description, date, expenseId, userId],
            function (err) {
              if (err) {
                console.error(err);
                return res.status(500).json({ error: "Database error" });
              }

              res.status(200).json({
                message: "Expense updated successfully",
              });
            }
          );
        }
      );
    }
  );
});

/**
 * @swagger
 * /api/expenses/{id}:
 *   delete:
 *     summary: Delete an expense
 *     tags: [Expenses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Expense deleted successfully
 *       404:
 *         description: Expense not found
 */
router.delete("/:id", middleware, (req, res) => {
  const userId = req.userId;
  const expenseId = req.params.id;

  db.run(
    "DELETE FROM expenses WHERE id = ? AND user_id = ?",
    [expenseId, userId],
    function (err) {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Database error" });
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: "Expense not found" });
      }

      res.status(200).json({
        message: "Expense deleted successfully",
      });
    }
  );
});

module.exports = router;
