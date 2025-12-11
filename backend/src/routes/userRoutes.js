const express = require('express');
const router = express.Router();
const db = require('../config/db');
const middleware = require('../middleware/authmiddleware');

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management endpoints
 */

/**
 * @swagger
 * /api/user/profile:
 *   get:
 *     summary: Get current user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns the user profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     salary:
 *                       type: number
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.get('/profile', middleware, (req, res) => {
	const userId = req.userId;
	db.get('SELECT name, email, salary, created_at FROM users WHERE id = ?', [userId], (err, row) => {
		if (err) {
			console.error('Database error:', err);
			res.status(500).json({error: err});
		}
		if (!row) {
			return res.status(404).json({ error: 'User not found' });
		}
		res.json ({
			user: {
				id: row.id,
				name: row.name,
				email: row.email,
				salary: row.salary,
				createdAt: row.created_at
			}
		});
	});
});

/**
 * @swagger
 * /api/user/updateSalary:
 *   put:
 *     summary: Update current user salary
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: New salary to update
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
 *         description: Salary updated successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.put('/updateSalary', middleware, (req, res) => {
	const userId = req.userId;
	const salary = req.body.salary;
	db.run('UPDATE users SET salary = ? WHERE id = ?', [salary, userId], (err) => {
		if (err) {
			console.error('Error updating Salary:', err.message);
			return res.status(500).json({ error: 'Database error' });;
		}
    	res.status(200).json({ message: 'Salary updated successfully' });
	})
})

module.exports = router;
