import Category from '../models/category-model.js';
import jwt from 'jsonwebtoken';
import config from'../config.js';
import User from '../models/user-model.js';

// Crear una nueva categoría
export const createCategory = async (req, res) => {
  try {
    const { name, description, rolesAllowed } = req.body;
    const newCategory = new Category({ name, description, rolesAllowed });
    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener todas las categorías
export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener todas las categorías
export const getCategories = async (req, res) => {
  const { name } = req.params;

  try {
    // Buscar una categoría cuyo nombre coincida con el nombre proporcionado
    const category = await Category.findOne({ name: name });
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener una categoría por ID
export const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Actualizar una categoría
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, rolesAllowed } = req.body;
    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { name, description, rolesAllowed },
      { new: true, runValidators: true }
    );
    if (!updatedCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(200).json(updatedCategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Eliminar una categoría
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCategory = await Category.findByIdAndDelete(id);
    if (!deletedCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Eliminar una categoría
export const deleteCategoryByUser = async (req, res) => {
  const { name, token } = req.body;

  if (!token) {
    return res.status(403).json({ message: 'Token no proporcionado' });
  }

  jwt.verify(token, config.app.secretKey, async (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Token inválido', isAuthenticated: false });
    } else {
      const userId = decoded.id;
      try {
        // Buscar el usuario por id, excluyendo la contraseña
        const user = await User.findById(userId).select('-password');
        if (!user) {
          return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        if (user.role !== 'ceo') {
          return res.status(403).json({ message: 'No tienes permiso para eliminar esta categoría' });
        }

        const deletedCategory = await Category.findOneAndDelete({ name });
        if (!deletedCategory) {
          return res.status(404).json({ message: 'Categoría no encontrada' });
        }

        return res.status(200).json({ message: 'Categoría eliminada con éxito' });
      } catch (error) {
        return res.status(500).json({ message: error.message });
      }
    }
  });
};