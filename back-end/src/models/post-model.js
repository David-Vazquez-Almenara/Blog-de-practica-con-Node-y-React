import mongoose from 'mongoose';

const { Schema } = mongoose;

const postSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    ref: 'User',
    required: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  publishedAt: {
    type: Date,
    default: Date.now
  },
  rolesAllowed: {
    type: [String], // Lista de roles que pueden acceder a esta categoría
    required: true,
  }
});

const Post = mongoose.model('Post', postSchema);

export default Post;
