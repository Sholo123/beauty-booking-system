import jwt from "jsonwebtoken";
import { sql } from "../config/db.js";

// Parse `Authorization: Bearer <token>` and verify the JWT.
// On success attaches `req.user = { userId }` to the request.
export const requireAuth = (req, res, next) => {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ message: "Missing or malformed Authorization header" });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (!payload || typeof payload.userId !== "number") {
      return res.status(401).json({ message: "Invalid token" });
    }
    req.user = { userId: payload.userId };
    return next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

// Requires the authenticated user to have role=admin.
// Must be used after `requireAuth`.
export const requireAdmin = async (req, res, next) => {
  if (!req.user || typeof req.user.userId !== "number") {
    return res.status(401).json({ message: "Authentication required" });
  }

  try {
    const rows = await sql`
      SELECT role FROM users WHERE user_id = ${req.user.userId}
    `;
    if (rows.length === 0 || rows[0].role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }
    req.user.role = "admin";
    return next();
  } catch (err) {
    console.error("Error verifying admin role:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Ensures the authenticated user is either the owner of the resource
// (based on a route param containing a user id) or an admin.
// `paramName` is the route param that holds the target user id.
export const requireSelfOrAdmin = (paramName = "userId") => async (req, res, next) => {
  if (!req.user || typeof req.user.userId !== "number") {
    return res.status(401).json({ message: "Authentication required" });
  }

  const targetId = Number.parseInt(req.params[paramName], 10);
  if (!Number.isInteger(targetId)) {
    return res.status(400).json({ message: `Invalid ${paramName}` });
  }

  if (targetId === req.user.userId) {
    return next();
  }

  try {
    const rows = await sql`
      SELECT role FROM users WHERE user_id = ${req.user.userId}
    `;
    if (rows.length > 0 && rows[0].role === "admin") {
      req.user.role = "admin";
      return next();
    }
    return res.status(403).json({ message: "Forbidden" });
  } catch (err) {
    console.error("Error in requireSelfOrAdmin:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
