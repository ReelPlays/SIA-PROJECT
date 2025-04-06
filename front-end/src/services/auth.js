import { gql } from '@apollo/client';

export const REGISTER_USER = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      token
      user {
        id
        username
        email
        fullName
        bio
        avatarUrl
        phoneNumber
        createdAt
        updatedAt
      }
    }
  }
`;

export const LOGIN_USER = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      token
      user {
        id
        username
        email
        fullName
        bio
        avatarUrl
        phoneNumber
        createdAt
        updatedAt
      }
    }
  }
`;

export const GET_ME = gql`
  query Me {
    me {
      id
      username
      email
      fullName
      bio
      avatarUrl
      phoneNumber
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_PROFILE = gql`
  mutation UpdateProfile($input: UpdateProfileInput!) {
    updateProfile(input: $input) {
      id
      username
      email
      fullName
      bio
      avatarUrl
      phoneNumber
      createdAt
      updatedAt
    }
  }
`;