import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../elements/header.js';
import '../css/blogStyleChild.css';

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

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
  return formattedDate;
};

const BlogStyleChild = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const response = await fetch(`http://localhost:8080/post/data/id/${postId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch post data');
        }
        const postData = await response.json();

        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Token not found');
        }

        const userId = await getUserId(token);

        const userResponse = await fetch(`http://localhost:8080/user/data/id/${userId}`);
        if (!userResponse.ok) {
          throw new Error('Failed to fetch user data');
        }
        const userData = await userResponse.json();

        const roles = postData.rolesAllowed || [];

        if (roles.includes(userData.role) || roles.includes('todos') || userData.role ==='ceo') {
          setPost(postData);
          setUserRole(userData.role);
        } else {
          throw new Error('User role not allowed');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchPostData();
  }, [postId]);

  if (!post || !userRole) {

    return <div>
      <Header />
      {/*No me arrepiento de esta salvajada*/}
      <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
      El post no carga correctamente, verifica si tu rol es el adecuado para ver el contenido o si el port/categoría existen.
    </div>

  }

  return (
    <div className="blog-style-child-container">
      <Header />
      <div className="post-container">
        <div className="post-content">
          <h2>{post.title}</h2>
          <p>{post.content}</p>
          <p>Author: {post.author}</p>
          <p>Published At: {formatDate(post.publishedAt)}</p>
        </div>
      </div>
    </div>
  );
};

export default BlogStyleChild;
