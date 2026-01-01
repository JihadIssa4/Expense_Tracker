const express = require("express");
const cors = require("cors");
const app = express();
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const categoryRoute = require("./routes/categoryRoute");
const expenseRoute = require("./routes/expenseRoutes");
const salaryRoutes = require("./routes/salaryRoutes");

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/categories", categoryRoute);
app.use("/api/expenses", expenseRoute);
app.use("/api/salary", salaryRoutes);

module.exports = app;
