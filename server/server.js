// server.js
import express from "express";
import dotenv from "dotenv";
import postgres from "postgres";
import userRouter from "./routes/userRoutes.js";
import serviceRouter from "./routes/serviceRoutes.js";
import appointmentRouter from "./routes/appointmentRoutes.js";
import feedbackRouter from "./routes/feedbackRoutes.js";
import cors from "cors";
import morgan from "morgan";

dotenv.config();

// --- Fail fast on missing required env vars ---
const REQUIRED_ENV = ["DATABASE_URL", "JWT_SECRET"];
for (const name of REQUIRED_ENV) {
  if (!process.env[name]) {
    console.error(`FATAL: environment variable ${name} is required`);
    process.exit(1);
  }
}

// Reject obviously weak JWT secrets.
if (
  process.env.JWT_SECRET.length < 32 ||
  /^(your[_-]?super[_-]?secret|change[_-]?me|secret|password)/i.test(process.env.JWT_SECRET)
) {
  console.error(
    "FATAL: JWT_SECRET is too weak. Use a long, random value (>=32 chars). Generate one with:\n" +
      "  node -e \"console.log(require('crypto').randomBytes(64).toString('hex'))\""
  );
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 4000;

// --- CORS: explicit allowlist, no wildcard ---
const allowedOrigins = (process.env.CORS_ORIGINS || "http://localhost:3000")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, cb) => {
      // Allow same-origin / curl / server-to-server requests (no Origin header).
      if (!origin) return cb(null, true);
      if (allowedOrigins.includes(origin)) return cb(null, true);
      return cb(new Error(`Origin ${origin} not allowed by CORS`));
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));
app.use("/uploads", express.static("uploads"));

// Simple healthcheck.
app.get("/", (req, res) => {
  res.send("Beauty Booking System Backend is running!");
});

// API endpoints
app.use("/api/users", userRouter);
app.use("/api/services", serviceRouter);
app.use("/api/appointments", appointmentRouter);
app.use("/api/feedback", feedbackRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.method} ${req.originalUrl} not found` });
});

// Central error handler (e.g. multer file-size / file-type errors).
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err && err.message ? err.message : err);
  const status = err && err.status ? err.status : 400;
  res.status(status).json({ message: err && err.message ? err.message : "Request failed" });
});

// ------------------------
// DATABASE CONNECTION
// ------------------------
const sslRejectUnauthorized =
  (process.env.PG_SSL_REJECT_UNAUTHORIZED || "true").toLowerCase() !== "false";
const sql = postgres(process.env.DATABASE_URL, {
  ssl: { rejectUnauthorized: sslRejectUnauthorized },
});

// ------------------------
// INIT DB FUNCTION
// ------------------------
async function initDB() {
  try {
    // Users
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        user_id SERIAL PRIMARY KEY,
        first_name VARCHAR(255) NOT NULL,
        last_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        location VARCHAR(255) NOT NULL,
        province VARCHAR(100) NOT NULL,
        role VARCHAR(50) DEFAULT 'client' CHECK (role IN ('client','admin')),
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Services
    await sql`
      CREATE TABLE IF NOT EXISTS services (
        service_id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10,2),
        duration_minutes INT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      )
    `;

    //Service Images
    await sql`
      CREATE TABLE IF NOT EXISTS service_images (
        image_id SERIAL PRIMARY KEY,
        service_id INT NOT NULL,
        image_url VARCHAR NOT NULL,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (service_id) REFERENCES services(service_id)
      )
    `;

    // Appointments
    await sql`
      CREATE TABLE IF NOT EXISTS appointments (
       appointment_id SERIAL PRIMARY KEY,
       user_id INT NOT NULL,
       service_id INT NOT NULL,
       appointment_date DATE NOT NULL,
       time_slot VARCHAR(20) NOT NULL,
       status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending','confirmed','cancelled','rejected')),
       created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
       FOREIGN KEY (user_id) REFERENCES users(user_id),
       FOREIGN KEY (service_id) REFERENCES services(service_id)
      )
    `;

    //Feedback
    await sql`
      CREATE TABLE IF NOT EXISTS feedback (
        feedback_id SERIAL PRIMARY KEY,
        appointment_id INT NOT NULL,
        user_id INT NOT NULL,
        service_id INT NOT NULL,
        rating INT CHECK (rating >= 1 AND rating <= 5),
        comment TEXT,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (appointment_id) REFERENCES appointments(appointment_id),
        FOREIGN KEY (user_id) REFERENCES users(user_id),
        FOREIGN KEY (service_id) REFERENCES services(service_id)
      )
    `;

    console.log("Database initialized successfully!");
  } catch (err) {
    console.error("Error initializing DB:", err);
  }
}

// ------------------------
// INITIALIZE DB THEN START SERVER
// ------------------------
initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
