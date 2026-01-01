const jwt = require("jsonwebtoken");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-key";

function verifyToken(req, res, next) {
  console.log("→ Middleware: Checking authentication...");

  // 1. Get token from header
  const authHeader = req.headers["authorization"];
  console.log("→ Authorization header:", authHeader);

  if (!authHeader) {
    console.log("✗ No authorization header");
    return res.status(401).json({ error: "No token provided" });
  }

  // 2. Extract token (format: "Bearer <token>")
  const token = authHeader.split(" ")[1];
  console.log("→ Extracted token:", token);

  if (!token) {
    console.log("✗ Token not found in header");
    return res.status(401).json({ error: "Invalid token format" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log("✓ Token verified! Decoded:", decoded);

    // 4. Attach userId to request
    req.userId = decoded.userId;
    console.log(req.userId);
    // 5. Continue to next middleware/route
    next();
  } catch (err) {
    console.log("✗ Token verification failed:", err.message);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

module.exports = verifyToken;
