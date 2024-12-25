import mongoose from 'mongoose';

const { Schema } = mongoose;

const categorySchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  rolesAllowed: {
    type: [String], // Lista de roles que pueden acceder a esta categoría
    required: true,
  },
  roleAllowedToMakePosts: {
    type: [String], // Lista de roles que pueden crear posts en esta categoría
    required: true,
  },
  postInCategory: {
    type: [String],
    required: false,
  }
});

const Category = mongoose.model('Category', categorySchema);

export default Category;
