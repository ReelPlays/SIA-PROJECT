const { 
  GraphQLSchema, 
  GraphQLObjectType, 
  GraphQLString, 
  GraphQLID, 
  GraphQLNonNull, 
  GraphQLInputObjectType,
  GraphQLList
} = require('graphql');

// Define User type
const UserType = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    username: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
    createdAt: { type: new GraphQLNonNull(GraphQLString) }
  }
});

// Define AuthPayload type
const AuthPayloadType = new GraphQLObjectType({
  name: 'AuthPayload',
  fields: {
    token: { type: new GraphQLNonNull(GraphQLString) },
    user: { type: new GraphQLNonNull(UserType) }
  }
});

// Define RegisterInput type
const RegisterInputType = new GraphQLInputObjectType({
  name: 'RegisterInput',
  fields: {
    username: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
    password: { type: new GraphQLNonNull(GraphQLString) }
  }
});

// Define LoginInput type
const LoginInputType = new GraphQLInputObjectType({
  name: 'LoginInput',
  fields: {
    email: { type: new GraphQLNonNull(GraphQLString) },
    password: { type: new GraphQLNonNull(GraphQLString) }
  }
});

// Define Comment type
const CommentType = new GraphQLObjectType({
  name: 'Comment',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID) },
    content: { type: new GraphQLNonNull(GraphQLString) },
    createdAt: { type: new GraphQLNonNull(GraphQLString) },
    author: { type: new GraphQLNonNull(UserType) },
    post: { type: new GraphQLNonNull(PostType) }
  })
});

// Define Post type
const PostType = new GraphQLObjectType({
  name: 'Post',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID) },
    content: { type: new GraphQLNonNull(GraphQLString) },
    createdAt: { type: new GraphQLNonNull(GraphQLString) },
    author: { type: new GraphQLNonNull(UserType) },
    likes: { type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserType))) },
    comments: { type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(CommentType))) }
  })
});

// Define Query type
const queryType = new GraphQLObjectType({
  name: 'Query',
  fields: {
    me: {
      type: UserType,
      resolve: async (parent, args, context) => {
        // TODO: Implement me query resolver
        return null;
      }
    },
    posts: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(PostType))),
      resolve: async () => {
        const { getAllPosts } = require('../database/posts');
        try {
          return await getAllPosts();
        } catch (error) {
          throw new Error('Failed to fetch posts: ' + error.message);
        }
      }
    }
  }
});

// Define Mutation type
const CreatePostInputType = new GraphQLInputObjectType({
  name: 'CreatePostInput',
  fields: {
    content: { type: new GraphQLNonNull(GraphQLString) }
  }
});

// Define CreateCommentInput type
const CreateCommentInputType = new GraphQLInputObjectType({
  name: 'CreateCommentInput',
  fields: {
    postId: { type: new GraphQLNonNull(GraphQLID) },
    content: { type: new GraphQLNonNull(GraphQLString) }
  }
});

const mutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    createPost: {
      type: new GraphQLNonNull(PostType),
      args: {
        input: { type: new GraphQLNonNull(CreatePostInputType) }
      },
      resolve: async (parent, { input }, context) => {
        const { createPost } = require('../database/posts');
        try {
          const post = await createPost(input);
          return post;
        } catch (error) {
          throw new Error('Failed to create post: ' + error.message);
        }
      }
    },
    register: {
      type: new GraphQLNonNull(AuthPayloadType),
      args: {
        input: { type: new GraphQLNonNull(RegisterInputType) }
      },
      resolve: async (parent, { input }, context) => {
        const { createUser } = require('../database/users');
        const { generateToken } = require('../auth/jwt.js');

        try {
          const user = await createUser(input);
          const token = generateToken(user.id);

          return {
            token,
            user: {
              id: user.id,
              username: user.username,
              email: user.email,
              createdAt: user.created_at
            }
          };
        } catch (error) {
          throw new Error('Failed to register user: ' + error.message);
        }
      }
    },
    login: {
      type: new GraphQLNonNull(AuthPayloadType),
      args: {
        input: { type: new GraphQLNonNull(LoginInputType) }
      },
      resolve: async (parent, args, context) => {
        const input = args.input;
        const { findUserByEmail, verifyPassword } = require('../database/users');
        const { generateToken } = require('../auth/jwt.js');

        try {
          const user = await findUserByEmail(input.email);
          if (!user) {
            throw new Error('<span style="color: red">Authentication failed: No account found with this email</span>');
          }

          const isValid = await verifyPassword(input.password, user.password);
          if (!isValid) {
            throw new Error('<span style="color: red">Authentication failed: Incorrect password</span>');
          }

          const token = generateToken(user.id);

          return {
            token,
            user: {
              id: user.id,
              username: user.username,
              email: user.email,
              createdAt: user.created_at
            }
          };
        } catch (error) {
          throw new Error('Authentication failed: ' + error.message);
        }
      }
    },
    createComment: {
      type: new GraphQLNonNull(CommentType),
      args: {
        input: { type: new GraphQLNonNull(CreateCommentInputType) }
      },
      resolve: async (parent, { input }, context) => {
        const { Comment } = require('../models/comment');
        try {
          const comment = await Comment.create({
            postId: input.postId,
            content: input.content,
            userId: context.user ? context.user.id : '1' // TODO: Get from context
          });
          return comment;
        } catch (error) {
          throw new Error('Failed to create comment: ' + error.message);
        }
      }
    }
  }
});

// Create and export the GraphQL schema
const schema = new GraphQLSchema({
  query: queryType,
  mutation: mutationType
});

module.exports = schema;