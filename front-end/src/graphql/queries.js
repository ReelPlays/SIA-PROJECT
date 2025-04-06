import { gql } from '@apollo/client';

export const GET_POSTS = gql`
  query GetPosts {
    posts {
      id
      content
      createdAt
      author {
        id
        username
      }
      likes {
        id
        username
      }
      comments {
        id
        content
        createdAt
        author {
          id
          username
        }
      }
    }
  }
`;

export const GET_USER_PROFILE = gql`
  query GetUserProfile($username: String!) {
    user(username: $username) {
      id
      username
      email
      createdAt
      posts {
        id
        content
        createdAt
      }
      followers {
        id
        username
      }
      following {
        id
        username
      }
    }
  }
`;