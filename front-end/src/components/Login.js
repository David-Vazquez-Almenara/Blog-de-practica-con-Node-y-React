import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 

function Login() {
  const [correo, setCorreo] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style = `
      font-family: Arial, sans-serif;
      margin: 0;
      margin-top: -50px;
      padding: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      background-color: #aeaeae;
    `;

    return () => {
      document.body.style = '';
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!correo || !contraseña) {
      setError('Por favor, complete todos los campos.');
      return;
    }

    setError('');

    const formData = {
      email: correo,
      password: contraseña
    };

    try {
      const response = await fetch('http://localhost:8080/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token); // Guarda el token en localStorage
        navigate('/');
      } else {
        setError('Credenciales inválidas. Por favor, inténtelo de nuevo.');
      }
    } catch (error) {
      console.error('Error:', error.message);
      setError('Ocurrió un error al conectar con el servidor, por favor inténtalo de nuevo más tarde.');
    }
  };

  return (
    <div className="container">
      <form id="login-form" onSubmit={handleSubmit}>
        <h2>Iniciar Sesión</h2>
        <div className="form-group">
          <label htmlFor="correo">Correo electrónico:</label>
          <input type="email" id="correo" name="correo" value={correo} onChange={(e) => setCorreo(e.target.value)} required />
        </div>
        <div className="form-group">
          <label htmlFor="contraseña">Contraseña:</label>
          <input type="password" id="contraseña" name="contraseña" value={contraseña} onChange={(e) => setContraseña(e.target.value)} required />
        </div>
        <button type="submit">Iniciar Sesión</button>
      </form>
      <p>¿No tienes una cuenta? <a href="/register">Regístrate aquí</a></p>
      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default Login;
