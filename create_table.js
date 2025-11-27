import pkg from 'pg';
import 'dotenv/config';
const { Client } = pkg;

// PostgreSQL connection (Render)
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function createTableAndInsertData() {
  try {
    await client.connect();
    console.log("Connected to PostgreSQL");

    // Create table
    const createQuery = `
      CREATE TABLE IF NOT EXISTS tasks (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        date DATE NOT NULL,
        priority VARCHAR(10) CHECK (priority IN ('low', 'medium', 'high')) NOT NULL,
        completed BOOLEAN DEFAULT false
      );
    `;
    await client.query(createQuery);
    console.log("Tasks table created successfully!");

    // Insert 2 rows
    const insertQuery = `
      INSERT INTO tasks (title, date, priority, completed)
      VALUES
        ('Finish project', '2025-11-26', 'high', false),
        ('Read documentation', '2025-11-27', 'medium', false)
      RETURNING *;
    `;
    const result = await client.query(insertQuery);
    console.log("Inserted rows:", result.rows);

    await client.end();
    console.log("Connection closed.");
  } catch (err) {
    console.error("Error:", err);
  }
}

createTableAndInsertData();
