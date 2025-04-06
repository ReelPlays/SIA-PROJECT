const { Client } = require('pg');
const bcrypt = require('bcrypt');

const initialClient = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'Loser123321',
  port: 5433,
});

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'social_media',
  password: 'Loser123321',
  port: 5433,
});

async function InitDB() {
  try {
    // First connect to default postgres database
    await initialClient.connect();

    // Check if database exists
    const result = await initialClient.query(
      "SELECT EXISTS(SELECT 1 FROM pg_database WHERE datname = $1)",
      ['social_media']
    );
    const exists = result.rows[0].exists;

    if (!exists) {
      await initialClient.query('CREATE DATABASE social_media');
    }

    await initialClient.end();

    // Connect to our target database
    await client.connect();
    console.log('Connected to PostgreSQL database');

    // Create tables
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Create default user if not exists
    const hashedPassword = await bcrypt.hash('defaultpass123', 10);
    await client.query(`
      INSERT INTO users (username, email, password)
      VALUES ($1, $2, $3)
      ON CONFLICT (email) DO NOTHING
    `, ['default_user', 'default@example.com', hashedPassword]);

  } catch (err) {
    console.error('Failed to initialize database:', err);
    throw err;
  }
}

module.exports = {
  InitDB,
  client,
};