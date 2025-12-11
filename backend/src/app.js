const express = require('express');
const app = express();
const routes = require('./routes/index');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const categoryRoute = require('./routes/categoryRoute');
const expenseRoute = require('./routes/expenseRoutes');

app.use(express.json());
app.use('/api', routes);
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/categories', categoryRoute);
app.use('/api/expenses', expenseRoute);

module.exports = app;
