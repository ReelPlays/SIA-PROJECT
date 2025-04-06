const { Post } = require('../../models/post');
const { Comment } = require('../../models/comment');

const postResolvers = {
  Query: {
    posts: async () => {
      try {
        const posts = await Post.find().sort({ createdAt: -1 });
        return posts;
      } catch (error) {
        throw new Error('Error fetching posts');
      }
    },
  },
  Post: {
    author: async (parent, _, { User }) => {
      try {
        const user = await User.findById(parent.author);
        return user;
      } catch (error) {
        throw new Error('Error fetching post author');
      }
    },
    comments: async (parent) => {
      try {
        const comments = await Comment.find({ post: parent.id }).sort({ createdAt: -1 });
        return comments;
      } catch (error) {
        throw new Error('Error fetching post comments');
      }
    },
  },
};

module.exports = postResolvers;