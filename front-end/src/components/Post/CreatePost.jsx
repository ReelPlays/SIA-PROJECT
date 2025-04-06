import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { gql } from '@apollo/client';

const CREATE_POST = gql`
  mutation CreatePost($content: String!) {
    createPost(content: $content) {
      id
      content
    }
  }
`;

export default function CreatePost() {
  const [content, setContent] = useState('');
  const [createPost] = useMutation(CREATE_POST, {
    refetchQueries: ['GetPosts']
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createPost({ variables: { content } });
    setContent('');
  };

  return (
    <form onSubmit={handleSubmit} className="create-post">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What's on your mind?"
      />
      <button type="submit">Post</button>
    </form>
  );
}