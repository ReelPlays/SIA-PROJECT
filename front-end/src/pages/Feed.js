import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_POSTS } from '../graphql/queries';
import './Feed.css';

function Feed() {
  const { loading, error, data } = useQuery(GET_POSTS);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading posts</div>;

  return (
    <div className="feed-container">
      {data.posts.map(post => (
        <div key={post.id} className="post-card">
          <div className="post-header">
            <h3>{post.user.username}</h3>
          </div>
          <div className="post-content">
            <p>{post.content}</p>
          </div>
          <div className="post-actions">
            <button className="action-button">
              <span role="img" aria-label="like">❤️</span>
              {post.likes}
            </button>
            <button className="action-button">
              <span role="img" aria-label="comment">💬</span>
              {post.comments.length}
            </button>
            <button className="action-button">
              <span role="img" aria-label="share">↗️</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Feed;