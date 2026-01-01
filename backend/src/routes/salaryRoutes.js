const express = require("express");
const router = express.Router();
const db = require("../config/db");
const middleware = require("../middleware/authmiddleware");

router.post("/", middleware, (req, res) => {
  const userId = req.userId;
  const { amount } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({ error: "Invalid salary amount" });
  }

  // 1️⃣ Deactivate previous active salary
  db.run(
    `
    UPDATE salaries
    SET is_active = 0
    WHERE user_id = ? AND is_active = 1
    `,
    [userId],
    function (err) {
      if (err) {
        console.error("Error deactivating salary:", err.message);
        return res.status(500).json({ error: "Database error" });
      }

      // 2️⃣ Insert new active salary
      db.run(
        `
        INSERT INTO salaries (user_id, amount, is_active)
        VALUES (?, ?, 1)
        `,
        [userId, amount],
        function (err) {
          if (err) {
            console.error("Error inserting salary:", err.message);
            return res.status(500).json({ error: "Database error" });
          }

          res.status(201).json({
            message: "Salary added successfully",
            salaryId: this.lastID,
            amount,
          });
        }
      );
    }
  );
});

router.get("/current", middleware, (req, res) => {
  const userId = req.userId;

  const query = `
    SELECT amount, created_at
    FROM salaries
    WHERE user_id = ? AND is_active = 1
    LIMIT 1
  `;

  db.get(query, [userId], (err, row) => {
    if (err) {
      return res.status(500).json({ error: "Database error" });
    }
    if (!row) {
      return res.status(200).json({ amount: null });
    }
    res.status(200).json(row);
  });
});

/**
 * @swagger
 * /api/salary/updateSalary:
 *   put:
 *     summary: Update current user salary
 *     tags: [Salaries]
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
router.put("/updateSalary", middleware, (req, res) => {
  const userId = req.userId;
  const newSalary = req.body.amount;
  if (!newSalary || newSalary <= 0) {
    return res.status(400).json({ error: "Invalid salary amount" });
  }
  db.run(
    "UPDATE salaries SET amount = ? WHERE id = ? AND is_active = 1",
    [newSalary, userId],
    (err) => {
      if (err) {
        console.error("Error updating Salary:", err.message);
        return res.status(500).json({ error: "Database error" });
      }
      if (this.changes === 0)
        return res.status(404).json({ error: "No active salary found" });
      res.status(200).json({ message: "Salary updated successfully" });
    }
  );
});

module.exports = router;
