import { sql } from "./src/config/db.js";

export async function initDB() {
  try {
    // ------------------------
    // CLIENTS / USERS
    // ------------------------
    await sql`
      CREATE TABLE IF NOT EXISTS clients (
        client_id SERIAL PRIMARY KEY,
        first_name VARCHAR(255) NOT NULL,
        last_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // ------------------------
    // SERVICES
    // ------------------------
    await sql`
      CREATE TABLE IF NOT EXISTS services (
        service_id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10,2),
        duration_minutes INT NOT NULL,
        image_url TEXT,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // ------------------------
    // APPOINTMENTS
    // ------------------------
    await sql`
      CREATE TABLE IF NOT EXISTS appointments (
        appointment_id SERIAL PRIMARY KEY,
        client_id INT NOT NULL,
        service_id INT NOT NULL,
        appointment_date DATE NOT NULL,
        start_time TIME NOT NULL,
        end_time TIME NOT NULL,
        status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (client_id) REFERENCES clients(client_id),
        FOREIGN KEY (service_id) REFERENCES services(service_id)
      )
    `;

    // ------------------------
    // FEEDBACK
    // ------------------------
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

    // ------------------------
    // OPTIONAL: ADMIN / STYLISTS
    // ------------------------
    await sql`
      CREATE TABLE IF NOT EXISTS stylists (
        stylist_id SERIAL PRIMARY KEY,
        first_name VARCHAR(255) NOT NULL,
        last_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE,
        phone VARCHAR(20),
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      )
    `;

    console.log("Database initialized successfully for Beauty Booking System!");
  } catch (err) {
    console.error("Error initializing database:", err);
  }
}
