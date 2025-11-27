import pkg from 'pg';
import 'dotenv/config';
const { Pool } = pkg;

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 5432,
  ssl: { rejectUnauthorized: false }
});

async function seedTasks() {
  try {
    await pool.connect();

    const query = `
      INSERT INTO tasks (title, date, priority, completed)
      VALUES
        ('Finish project', '2025-11-26', 'high', false),
        ('Read documentation', '2025-11-27', 'medium', false)
      RETURNING *;
    `;

    const result = await pool.query(query);
    console.log('Inserted tasks:', result.rows);

    await pool.end();
  } catch (err) {
    console.error('Error seeding tasks:', err);
  }
}

seedTasks();
