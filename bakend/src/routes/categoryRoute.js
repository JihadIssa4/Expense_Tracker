const express = require('express');
const router = express.Router();
const db = require('../config/db');
const middleware = require('../middleware/authmiddleware');

router.post('/addCategory', middleware, (req, res) => {
	const userId = req.userId;
	const name = req.body.name;
	const amount = req.body.expected_amount;
	db.run('INSERT INTO expense_categories (name, expected_amount, user_id) VALUES (?, ?, ?)',
		[name, amount, userId],
		(err) => {
			if (err)
			{
				console.error('Inserting failed');
				res.status(500).json({ error: 'Error inserting data'});
				return ;
			}
			console.log('Records inserted successfully');
			return res.status(201).json({id: userId, name: name, amount: amount});
		})
});

router.get('/allCategories', middleware, (req, res) => {
	const userId = req.userId;
	const query = 'SELECT expense_categories.id, expense_categories.name, expense_categories.expected_amount, \
					COALESCE(SUM(expenses.amount), 0) as actual_spent FROM expense_categories LEFT JOIN expenses ON expense_categories.id = expenses.category_id \
					WHERE expense_categories.user_id = ? GROUP BY expense_categories.id'
	db.all(query, [userId], (err, categories) => {
    	if (err) {
      		console.error('Database error:', err);
      		return res.status(500).json({ error: 'Database error' });
    	}
		console.log('Success');
		res.json({
			categories: categories,
    		count: categories.length
		})
	})
})

router.delete('/delCategory/:id', middleware, (req, res) =>{
	const id = req.params.id;
	db.run('DELETE FROM expense_categories WHERE id = ?', [id], (err) => {
		if (err)
		{
			console.error('Database error:', err);
			return res.status(500).json({error: 'Database error'});
		}
		console.log('Category Deleted');
		return res.status(200).json({success: 'success'});
	})
})
module.exports = router;