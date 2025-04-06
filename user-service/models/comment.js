const { v4: uuidv4 } = require('uuid');
const db = require('../database/postgres');

class Comment {
  static async find({ post: postId }) {
    const query = `
      SELECT 
        c.id, 
        c.content, 
        c.created_at,
        u.id as author_id,
        u.username as author_username,
        u.email as author_email,
        u.created_at as author_created_at
      FROM comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.post_id = $1
      ORDER BY c.created_at DESC
    `;

    const result = await db.query(query, [postId]);
    
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
      post: postId
    }));
  }

  static async create({ postId, content, userId }) {
    const commentId = uuidv4();
    const createdAt = new Date().toISOString();

    const query = `
      INSERT INTO comments (id, content, post_id, user_id, created_at)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, content, created_at
    `;

    const result = await db.query(query, [commentId, content, postId, userId, createdAt]);
    const comment = result.rows[0];

    // Get author information
    const authorQuery = 'SELECT id, username, email, created_at FROM users WHERE id = $1';
    const authorResult = await db.query(authorQuery, [userId]);
    
    return {
      id: comment.id,
      content: comment.content,
      createdAt: comment.created_at,
      author: authorResult.rows[0],
      post: postId
    };
  }
}

module.exports = { Comment };