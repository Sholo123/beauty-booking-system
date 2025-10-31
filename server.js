// server.js
import express from "express";
import dotenv from "dotenv";
import postgres from "postgres";
import userRouter from "./server/routes/userRoutes.js";



dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());

app.use('/api/users', userRouter);

// ------------------------
// DATABASE CONNECTION
// ------------------------
const sql = postgres(process.env.DATABASE_URL, {
  ssl: { rejectUnauthorized: false } // required for Neon
});
app.get("/", (req, res) => {
  res.send("Hello from the backend");
});

app.use((req, res) => {
  res
    .status(404)
    .json({ message: `Route ${req.method} ${req.originalUrl} not found` });
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

    // Appointments
    await sql`
      CREATE TABLE IF NOT EXISTS appointments (
        appointment_id SERIAL PRIMARY KEY,
        client_id INT NOT NULL,
        service_id INT NOT NULL,
        appointment_date DATE NOT NULL,
        start_time TIME NOT NULL,
        end_time TIME NOT NULL,
        status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending','confirmed','completed','cancelled')),
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (client_id) REFERENCES clients(client_id),
        FOREIGN KEY (service_id) REFERENCES services(service_id)
      )
    `;

    // Feedback
    await sql`
      CREATE TABLE IF NOT EXISTS feedback (
        feedback_id SERIAL PRIMARY KEY,
        appointment_id INT NOT NULL,
        rating INT CHECK (rating >= 1 AND rating <= 5),
        comment TEXT,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (appointment_id) REFERENCES appointments(appointment_id)
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
  app.get("/", (req, res) => {
    res.send("Beauty Booking System Backend is running!");
  });

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
