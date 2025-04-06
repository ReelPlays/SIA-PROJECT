import React from 'react';

export default function PostItem({ post }) {
  return (
    <div className="post-item">
      <div className="post-header">
        <div className="post-avatar"></div>
        <div>
          <div className="post-author">{post?.author?.username || 'Unknown'}</div>
          <div className="post-time">{new Date(post?.createdAt).toLocaleString()}</div>
        </div>
      </div>
      <div className="post-content">{post?.content}</div>
      <div className="post-actions">
        <button>Like</button>
        <button>Comment</button>
        <button>Share</button>
      </div>
    </div>
  );
}