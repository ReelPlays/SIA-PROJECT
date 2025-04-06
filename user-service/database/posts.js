const { v4: uuidv4 } = require('uuid');
const db = require('./postgres');

async function createPost(input) {
  const postId = uuidv4();
  const userId = '1'; // TODO: Get from context
  const createdAt = new Date().toISOString();

  const query = `
    INSERT INTO posts (id, content, author_id, created_at)
    VALUES ($1, $2, $3, $4)
    RETURNING id, content, created_at, author_id
  `;

  const result = await db.query(query, [postId, input.content, userId, createdAt]);
  const post = result.rows[0];

  // Initialize empty arrays for likes and comments
  post.likes = [];
  post.comments = [];

  // Get author information
  const authorQuery = 'SELECT id, username, email, created_at FROM users WHERE id = $1';
  const authorResult = await db.query(authorQuery, [post.author_id]);
  post.author = authorResult.rows[0];

  return post;
}

async function getAllPosts() {
  const query = `
    SELECT 
      p.id, 
      p.content, 
      p.created_at,
      u.id as author_id,
      u.username as author_username,
      u.email as author_email,
      u.created_at as author_created_at
    FROM posts p
    JOIN users u ON p.author_id = u.id
    ORDER BY p.created_at DESC
  `;

  const result = await db.query(query);
  
  return result.rows.map(row => ({
    id: row.id,
    content: row.content,
    createdAt: row.created_at,
    author: {
      id: row.author_id,
      username: row.author_username,
      email: row.author_email,
      createdAt: row.author_created_at
    },
    likes: [], // Initialize empty array for likes
    comments: [] // Initialize empty array for comments
  }));
}

module.exports = {
  createPost,
  getAllPosts
};