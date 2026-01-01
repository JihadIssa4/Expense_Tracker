const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../config/db");
const middleware = require("../middleware/authmiddleware");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//const passRegex = "^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$";

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication endpoints
 */

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: Register a new user
 *     description: Creates a user account.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - name
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@test.com
 *               password:
 *                 type: string
 *                 example: Pass1234
 *               name:
 *                 type: string
 *                 example: Jihad
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User signed up successfully
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOi...
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     email:
 *                       type: string
 *                     name:
 *                       type: string
 *                     salary:
 *                       type: integer
 *       400:
 *         description: Invalid email or password
 *       500:
 *         description: Server error
 */
router.post("/signup", async (req, res) => {
  const { email, password, name } = req.body;

  // Validation
  if (!email || !password || !name) {
    return res.status(400).json({
      error: "Email, password, and name are required",
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  if (password.length < 8) {
    return res.status(400).json({
      error: "Password must be at least 8 characters",
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    db.run(
      "INSERT INTO users (email, password, name) VALUES (?, ?, ?)",
      [email, hashedPassword, name],
      function (err) {
        // Handle errors
        if (err) {
          if (err.message.includes("UNIQUE constraint failed")) {
            return res.status(400).json({
              error: "Email already exists",
            });
          }
          console.error("Database error:", err);
          return res.status(500).json({ error: "Database error" });
        }
        // ✅ Send response HERE (inside callback)
        res.status(201).json({
          message: "User signed up successfully",
          user: {
            id: this.lastID,
            email: email,
            name: name,
          },
        });
      }
    );
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * @swagger
 * /api/auth/signin:
 *   post:
 *     summary: Login a user
 *     description: Authenticates user and returns a JWT token.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@test.com
 *               password:
 *                 type: string
 *                 example: Pass1234
 *     responses:
 *       201:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User IN
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOi...
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     email:
 *                       type: string
 *       400:
 *         description: Missing credentials
 *       401:
 *         description: Invalid email or password
 *       500:
 *         description: Server error
 */
router.post("/signin", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      error: "Email and password are required",
    });
  }
  db.get("SELECT * FROM users WHERE email = ?", [email], async (err, row) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Database error" });
    }

    if (!row) return res.status(401).json({ error: "Invalid email" });

    try {
      const validPassword = await bcrypt.compare(password, row.password);
      if (!validPassword) {
        return res.status(401).json({
          error: "Invalid email or password",
        });
      } else {
        console.log(row.id);
        const token = jwt.sign({ userId: row.id }, JWT_SECRET, {
          expiresIn: JWT_EXPIRES_IN,
        });
        res.status(201).json({
          message: "User IN",
          token: token,
          user: {
            id: row.id,
            email: row.email,
            name: row.name,
          },
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Server error" });
    }
  });
});

router.get("/me", middleware, (req, res) => {
  const userId = req.userId;

  db.get(
    "SELECT id, name, email FROM users WHERE id = ?",
    [userId],
    (err, row) => {
      if (err) {
        return res.status(500).json({ message: "Database error" });
      }
      if (!row) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.json(row);
    }
  );
});

module.exports = router;
