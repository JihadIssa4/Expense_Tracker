const express = require('express');
const router = express.Router();
const authRoutes = require('../middleware/authmiddleware');
const verifyToken = require('../middleware/authmiddleware');

router.get('/users', verifyToken ,(req, res) => {
  res.json({ message: 'Backend working fine' });
});

module.exports = router;
