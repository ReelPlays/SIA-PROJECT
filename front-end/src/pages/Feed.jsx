import React from 'react';
import { useQuery } from '@apollo/client';
import { gql } from '@apollo/client';
import PostList from '../components/Post/PostList';
import CreatePost from '../components/Post/CreatePost';

const GET_POSTS = gql`
  query GetPosts {
    posts {
      id
      content
      author {
        id
        username
      }
      createdAt
    }
  }
`;

function Feed() {
  const { loading, error, data } = useQuery(GET_POSTS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="feed">
      <h2>Your Feed</h2>
      <CreatePost />
      <PostList posts={data.posts} />
    </div>
  );
}

export default Feed;