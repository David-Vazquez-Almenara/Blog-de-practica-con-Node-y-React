import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Asegúrate de que useNavigate está importado correctamente

function Registro() {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [correo, setCorreo] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [confirmarContraseña, setConfirmarContraseña] = useState('');
  const [error, setError] = useState('');
  const [contraseñasCoinciden, setContraseñasCoinciden] = useState(true);
  const navigate = useNavigate(); // Aquí estamos usando useNavigate, asegúrate de que esté importado correctamente

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

    if (!nombre || !apellido || !correo || !contraseña || !confirmarContraseña) {
      setError('Por favor, complete todos los campos.');
      return;
    }

    if (contraseña !== confirmarContraseña) {
      setError('Las contraseñas no coinciden.');
      setContraseñasCoinciden(false);
      return;
    }

    setError('');
    setContraseñasCoinciden(true);

    const formData = {
      name: nombre,
      surname: apellido,
      password: contraseña,
      email: correo
    };

    try {
      const response = await fetch('http://localhost:8080/user/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        navigate('/login');
      } else {
        const data = await response.json();
        if (response.status === 400) {
          setError(data.message);
        } else {
          throw new Error('Error en la solicitud de registro.');
        }
      }
    } catch (error) {
      console.error('Error:', error.message);
      setError('Ocurrió un error al conectar con el servidor, por favor inténtalo de nuevo más tarde.');
    }
  };

  return (
    <div className="container">
      <form id="register-form" onSubmit={handleSubmit}>
        <h2>Registro</h2>
        <div className="form-group">
          <label htmlFor="nombre">Nombre:</label>
          <input type="text" id="nombre" name="nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
        </div>
        <div className="form-group">
          <label htmlFor="apellido">Apellido:</label>
          <input type="text" id="apellido" name="apellido" value={apellido} onChange={(e) => setApellido(e.target.value)} required />
        </div>
        <div className="form-group">
          <label htmlFor="correo">Correo electrónico:</label>
          <input type="email" id="correo" name="correo" value={correo} onChange={(e) => setCorreo(e.target.value)} required />
        </div>
        <div className="form-group">
          <label htmlFor="contraseña">Contraseña:</label>
          <input type="password" id="contraseña" name="contraseña" value={contraseña} onChange={(e) => setContraseña(e.target.value)} required />
        </div>
        <div className="form-group">
          <label htmlFor="confirmar-contraseña">Confirmar Contraseña:</label>
          <input type="password" id="confirmar-contraseña" name="confirmar-contraseña" value={confirmarContraseña} onChange={(e) => setConfirmarContraseña(e.target.value)} required style={{ backgroundColor: contraseñasCoinciden ? 'initial' : 'pink' }} />
        </div>
        <button type="submit">Registrarse</button>
      </form>
      <p>¿Ya tienes una cuenta? <a href="/login">Inicia sesión</a></p>
      {error && <p className="error">{error}</p>}

    </div>
  );
}

export default Registro;
