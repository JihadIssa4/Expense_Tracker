const express = require('express');
const router = express.Router();
const db = require('../config/db');
const middleware = require('../middleware/authmiddleware');

router.post('/addExpense', middleware, (req, res) => {
	const userId = req.userId;
	const {category_id, amount, description, date} = req.body;
	db.get('SELECT user_id FROM expense_categories WHERE user_id = ?', [userId], (err, row) => {
		if (err) {
		console.error('Database error:', err);
		return res.status(500).json({ error: 'Database error' });
		}

		if (!row) {
		return res.status(404).json({ error: 'User not found in expense_categories' });
		}
	});
	const query = 'INSERT INTO expenses (category_id, amount, description, date) VALUES (?, ?, ?, ?)';
	db.run(query, [category_id, amount, description, date], (err) => {
		if (err){
			console.error('Database error:', err);
			return res.status(500).json({ error: 'Database error' });
		}
		else{
			return res.json({
				expense:{
					category_id: category_id,
					amount: amount,
					description: description,
					date: date
				}
			});
		}
	})
})

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