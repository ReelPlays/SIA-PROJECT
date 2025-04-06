const { Post } = require('../../models/post');
const { Comment } = require('../../models/comment');

const mutationResolvers = {
  Mutation: {
    createPost: async (_, { content }, { user }) => {
      if (!user) {
        throw new Error('You must be logged in to create a post');
      }

      try {
        const newPost = new Post({
          content,
          author: user.id,
          createdAt: new Date().toISOString()
        });

        const post = await newPost.save();
        return post;
      } catch (error) {
        throw new Error('Error creating post');
      }
    },
    createComment: async (_, { input }, { user }) => {
      if (!user) {
        throw new Error('You must be logged in to create a comment');
      }

      try {
        const comment = await Comment.create({
          postId: input.postId,
          content: input.content,
          userId: user.id
        });
        return comment;
      } catch (error) {
        throw new Error('Error creating comment');
      }
    }
  }
};

module.exports = mutationResolvers;