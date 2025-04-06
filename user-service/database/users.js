const { client } = require('./postgres');
const bcrypt = require('bcrypt');

async function createUser({ username, email, password }) {
  const hashedPassword = await bcrypt.hash(password, 10);
  
  const result = await client.query(
    'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email, created_at',
    [username, email, hashedPassword]
  );

  return result.rows[0];
}

async function findUserByEmail(email) {
  const result = await client.query(
    'SELECT id, username, email, password, created_at FROM users WHERE email = $1',
    [email]
  );

  return result.rows[0];
}

async function verifyPassword(password, hashedPassword) {
  return bcrypt.compare(password, hashedPassword);
}

module.exports = {
  createUser,
  findUserByEmail,
  verifyPassword
};