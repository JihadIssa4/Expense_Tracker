const express = require('express');
const router = express.Router();
const db = require('../config/db');
const middleware = require('../middleware/authmiddleware');

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

router.put('/updateSalary', middleware, (req, res) => {
	const userId = req.userId;
	const salary = req.body.salary;
	console.log(salary);
	db.run('UPDATE users SET salary = ? WHERE id = ?', [salary, userId], (err) => {
		if (err) {
			console.error('Error inserting Salary:', err.message);
			return res.status(500).json({ error: 'Database error' });;
		}
		console.log('Salary updated successfully');
    	res.status(200).json({ message: 'Salary updated successfully' });
	})
})

module.exports = router;