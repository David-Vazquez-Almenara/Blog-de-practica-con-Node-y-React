import React, { useEffect, useState, useRef } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import update from 'immutability-helper';
import { useNavigate } from 'react-router-dom';
import Header from '../elements/header.js';
import '../css/category.css'; // Importar el archivo CSS

async function getAllCategories() {
  try {
    const response = await fetch('http://localhost:8080/category/data/');
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const categories = await response.json();
    return categories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
}

async function deleteCategory(categoryName, token) {
  try {
    const response = await fetch(`http://localhost:8080/category/deleteByUser`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name: categoryName, token: token })
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error deleting category:', error);
    throw error;
  }
}

async function getUserId(token) {
  try {
    const response = await fetch(`http://localhost:8080/getID/token/${token}`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const { userId } = await response.json();
    return userId;
  } catch (error) {
    console.error('Error fetching user ID:', error);
    throw error;
  }
}

const ItemTypes = {
  CATEGORY: 'category',
};

const DraggableCategory = ({ category, index, moveCategory, handleCategoryClick, handleMenuClick, showMenu, menuRef, handleDeleteClick, userRole }) => {
  const ref = useRef(null);

  const [, drop] = useDrop({
    accept: ItemTypes.CATEGORY,
    hover(item, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      moveCategory(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.CATEGORY,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  return (
    <div ref={ref} className="category-item" style={{ opacity: isDragging ? 0.5 : 1, backgroundColor: category.backgroundColor }}>
      <div className='drag-handle'>⋮⋮</div>
      <div className='titleAndDescription' onClick={() => handleCategoryClick(category.name)}>
        <h2>{category.name}</h2>
        <p>{category.description}</p>
      </div>

      <ul className="ranks-list">
        {category.rolesAllowed && category.rolesAllowed.map((role, index) => (
          <li key={index} className="ranks-list-item">
            {role}
          </li>
        ))}
      </ul>

      {/* BOTON PARA DICION */}
      {/*
       <button className="options-button" onClick={() => handleMenuClick(category.name)}>⋮</button> 
  */}
      {showMenu === category.name && (
        <div className="options-menu" ref={menuRef}>
          <center><h2>{category.name}</h2></center>

          {(userRole === 'ceo' || userRole === 'empleado') && (
            <button>📖 Editar</button>
          )}

          {(userRole === 'ceo' || userRole === 'empleado') && (
            <button >📌 Fijar</button>
          )}

          {/*      
          {userRole === 'ceo' && (
            <button className='borrar' onClick={() => handleDeleteClick(category.name)}>❌ Borrar</button>
          )}
  */}

        </div>
      )}
    </div>
  );
};

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [filter, setFilter] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [showMenu, setShowMenu] = useState(null);
  const [userRole, setUserRole] = useState('');
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await getAllCategories();
        const savedOrder = JSON.parse(localStorage.getItem('categoryOrder'));
        if (savedOrder) {
          const orderedCategories = savedOrder.map(name => categoriesData.find(cat => cat.name === name));
          // Filter out categories that might have been deleted
          const existingCategories = orderedCategories.filter(cat => cat);
          // Add any new categories that are not in the saved order
          const missingCategories = categoriesData.filter(cat => !savedOrder.includes(cat.name));
          setCategories([...existingCategories, ...missingCategories]);
        } else {
          setCategories(categoriesData);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchUserRole = async () => {
      const token = localStorage.getItem('token'); // Suponiendo que el token está almacenado en localStorage
      try {
        const userId = await getUserId(token);
        const userResponse = await fetch(`http://localhost:8080/user/data/id/${userId}`);
        if (!userResponse.ok) {
          throw new Error(`HTTP error! Status: ${userResponse.status}`);
        }
        const userData = await userResponse.json();
        setUserRole(userData.role);
      } catch (error) {
        console.error('Error fetching user role:', error);
      }
    };

    fetchUserRole();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const moveCategory = (dragIndex, hoverIndex) => {
    const draggedCategory = categories[dragIndex];
    const newCategories = update(categories, {
      $splice: [
        [dragIndex, 1],
        [hoverIndex, 0, draggedCategory],
      ],
    });
    setCategories(newCategories);
    const categoryOrder = newCategories.map(category => category.name);
    localStorage.setItem('categoryOrder', JSON.stringify(categoryOrder));
  };

  const handleCategoryClick = (categoryName) => {
    const formattedName = categoryName
      .replace(/[^a-zA-Z0-9 ]/g, '')  // Eliminar iconos y caracteres especiales
      .trim()
      .replace(/\s+/g, '-')
      .toLowerCase();

    navigate(`/categorias/${formattedName}`);
  };

  const handleClearFilter = () => {
    setFilter('');
  };

  const handleRoleChange = (e) => {
    setSelectedRole(e.target.value);
  };

  const handleMenuClick = (categoryName) => {
    setShowMenu(categoryName === showMenu ? null : categoryName);
  };

  const handleDeleteClick = (categoryName) => {
    setCategoryToDelete(categoryName);
    setShowConfirm(true);
    setShowMenu(null);
  };

  const handleConfirmDelete = async () => {
    const token = localStorage.getItem('token');
    try {
      await deleteCategory(categoryToDelete, token);
      setCategories(categories.filter(category => category.name !== categoryToDelete));
      setShowConfirm(false);
      setCategoryToDelete(null);
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  const handleCancelDelete = () => {
    setShowConfirm(false);
    setCategoryToDelete(null);
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(filter.toLowerCase()) &&
    ((!selectedRole && userRole === 'ceo') || (category.rolesAllowed.includes('todos')) || (!selectedRole && category.rolesAllowed.includes(userRole)) || (selectedRole && category.rolesAllowed.includes(selectedRole)))
  );


  const handleCategoryCodeClick = (categoryName) => {
    const formattedName = categoryName
      .replace(/[^a-zA-Z0-9 ]/g, '')  // Eliminar iconos y caracteres especiales
      .trim()
      .replace(/\s+/g, '-')
      .toLowerCase();
    navigate(`/categorias/${formattedName}`);
  };






  return (
    <DndProvider backend={HTML5Backend}>
      <div className="container">
        <Header />
        <h1>CATEGORÍAS</h1>

        <div id='filter-container'>
          <select value={selectedRole} onChange={handleRoleChange}>
            <option value="">Roles</option>
            <option value="todos">Todos</option>
            <option value="empleado">Empleado</option>
          </select>
          <input
            type="text"
            placeholder="Filtrar categoría"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
          <button id="clearFilterButton" onClick={handleClearFilter}>X</button>
        </div>

        <div className='arrastrarInfo'>
          Puedes arrastrar las categorías para ordénalas como más te guste usando ⋮⋮
        </div>

        <div id="Category-container">

          {filteredCategories.map((category, index) => (
            <DraggableCategory
              key={category.id}
              index={index}
              category={category}
              moveCategory={moveCategory}
              handleCategoryClick={handleCategoryClick}
              handleMenuClick={handleMenuClick}
              showMenu={showMenu}
              menuRef={menuRef}
              handleDeleteClick={handleDeleteClick}
              userRole={userRole}
            />
          ))}







          <div className="category-item" onClick={() => handleCategoryCodeClick('👥 Empleados')}>
            <div className='drag-handle-fixed'>📌</div>
            <div className="titleAndDescription">
              <h2>👥 Empleados</h2>
              <p>Informacion de nuestros empleados.</p>
            </div>
            <ul className="ranks-list">
              <li className="ranks-list-item">todos</li>
            </ul>
          </div>

          {userRole === 'ceo' && (
            <div className="category-item" onClick={() => handleCategoryCodeClick('📚 Gestionar usuarios')}>
              <div className='drag-handle-fixed'>📌</div>
              <div className="titleAndDescription">
                <h2>📚 Gestionar usuarios</h2>
                <p>Aquí podrá ver los servicios solicitados.</p>
              </div>
              <ul className="ranks-list">
                <li className="ranks-list-item">ceo</li>
              </ul>
            </div>
          )}











        </div>

        {showConfirm && (
          <div className="confirm-modal">
            <div className="confirm-modal-content">
              <p>¿Quieres borrar la categoría <b>{categoryToDelete}</b>?</p>
              <button onClick={handleConfirmDelete} style={{ backgroundColor: '#b2ffb2' }}>Sí</button>
              <button onClick={handleCancelDelete} style={{ backgroundColor: '#ff8b8b' }}>No</button>
            </div>
          </div>
        )}
      </div>
    </DndProvider>
  );
};

export default Category;
