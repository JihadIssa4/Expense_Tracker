const express = require('express');
const router = express.Router();
const db = require('../config/db');
const middleware = require('../middleware/authmiddleware');

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
router.post('/addExpense', middleware, (req, res) => {
    const userId = req.userId;
    const { category_id, amount, description, date } = req.body;

    db.get('SELECT user_id FROM expense_categories WHERE user_id = ?', [userId], (err, row) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error' });
        }

        if (!row) {
            return res.status(404).json({ error: 'User not found in expense_categories' });
        }

        const query = 'INSERT INTO expenses (category_id, amount, description, date) VALUES (?, ?, ?, ?)';
        db.run(query, [category_id, amount, description, date], (err) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ error: 'Database error' });
            }

            return res.json({
                expense: {
                    category_id,
                    amount,
                    description,
                    date
                }
            });
        });
    });
});


/**
 * @swagger
 * /api/user/updateSalary:
 *   get:
 *     summary: Get all expenses
 *     tags: [Expenses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: getting all expenses for the users
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               salary:
 *                 type: number
 *     responses:
 *       200:
 *         description: All expenses retrieved
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.get('/allExpenses/:categoryId', middleware, (req, res) => {
	const userId = req.userId;
	const categoryId = req.params.categoryId;
	db.get('SELECT user_id FROM expense_categories WHERE user_id = ?', [userId], (err, row) => {
		if (err) {
		console.error('Database error:', err);
		return res.status(500).json({ error: 'Database error' });
		}

		if (!row) {
		return res.status(404).json({ error: 'User not found in expense_categories' });
		}
	});

	db.all('SELECT amount, description, date FROM expenses WHERE category_id = ?', [categoryId], (err, rows) => {
		if (err) {
		console.error('Database error:', err);
		return res.status(500).json({ error: 'Database error' });
		}
		res.status(200).json(rows);
	})
})

module.exports = router;