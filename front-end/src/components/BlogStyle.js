import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../elements/header.js'; // Importar el componente Header
import '../css/blogStyle.css';

const BlogStyle = ({ categoryId }) => {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [rolesAllowed, setSolesAllowed] = useState('');

  const navigate = useNavigate(); // Función para la navegación

  

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`http://localhost:8080/category/data/id/${categoryId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const categoryData = await response.json();
        setSolesAllowed(categoryData.rolesAllowed);
        const postIds = categoryData.postInCategory || [];

        const fetchedPosts = await Promise.all(postIds.map(async postId => {
          const postResponse = await fetch(`http://localhost:8080/post/data/id/${postId}`);
          if (!postResponse.ok) {
            throw new Error('Failed to fetch post data');
          }
          return postResponse.json();
        }));

        setPosts(fetchedPosts);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchPosts();
  }, [categoryId]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const token = localStorage.getItem('token'); // Obteniendo el token del localStorage
      const response = await fetch('http://localhost:8080/post/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title, content, categoryId, token, rolesAllowed }) // Envía rolesAllowed junto con el resto de los datos
      });

      if (!response.ok) {
        throw new Error('Failed to create post');
      }

      // Actualizar la lista de publicaciones
      const updatedResponse = await fetch(`http://localhost:8080/category/data/id/${categoryId}`);
      if (!updatedResponse.ok) {
        throw new Error('Failed to fetch updated data');
      }
      const updatedCategoryData = await updatedResponse.json();
      const updatedPostIds = updatedCategoryData.postInCategory || [];

      const updatedPosts = await Promise.all(updatedPostIds.map(async postId => {
        const postResponse = await fetch(`http://localhost:8080/post/data/id/${postId}`);
        if (!postResponse.ok) {
          throw new Error('Failed to fetch updated post data');
        }
        return postResponse.json();
      }));

      setPosts(updatedPosts);

      setTitle('');
      setContent('');
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
    return formattedDate;
  };

  const handlePostClick = (postId) => {
    navigate(`/categorias/${categoryId}/post/${postId}`);
  };

  return (
    <div>
      <Header />
      <div className="container">
        <h2>Posts in Category</h2>
        <ul id="Category-container-blog">
          {posts.map(post => (
            <li className="blog-item" key={post._id} onClick={() => handlePostClick(post._id)}>
              <div className="title-blog">
                <h3>{post.title}</h3>
              </div>
              <div className="author-date-blog">
                <p>Por <b><span className="author-blog">{post.author}</span></b> a <span className="date-blog">{formatDate(post.publishedAt)}</span></p>
              </div>
            </li>
          ))}
        </ul>

        <h2>Create New Post</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
          <textarea placeholder="Content" value={content} onChange={(e) => setContent(e.target.value)} />
          <button type="submit">Create Post</button>
        </form>
      </div>
      
    </div>
  );
};

export default BlogStyle;
