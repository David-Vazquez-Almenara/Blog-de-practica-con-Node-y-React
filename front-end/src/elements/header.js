import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/header.css';

const Header = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [showMenu, setShowMenu] = useState(false); // Estado para controlar la visibilidad del menú
  const [isLoading, setIsLoading] = useState(true); // Estado para indicar si se está cargando
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const tokenResponse = await fetch(`http://localhost:8080/getID/token/${token}`);
          if (tokenResponse.ok) {
            const tokenData = await tokenResponse.json();
            const userId = tokenData.userId;

            // Fetch user data using user ID
            const userResponse = await fetch(`http://localhost:8080/user/data/id/${userId}`);
            if (userResponse.ok) {
              const userData = await userResponse.json();
              setIsAuthenticated(true);
              setUser(userData);
            } else {
              setIsAuthenticated(false);
              setUser(null);
            }
          } else {
            setIsAuthenticated(false);
            setUser(null);
          }
        } catch (error) {
          console.error('Error al verificar el token o al obtener los datos del usuario:', error);
          setIsAuthenticated(false);
          setUser(null);
        }
      }
      // Establecer isLoading en falso después de completar la verificación de la autenticación
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUser(null);
    navigate('/');
  };


  const handleMenuToggle = () => {
    setShowMenu(!showMenu); // Cambiar el estado para mostrar u ocultar el menú
  };

  // Mostrar el indicador de carga si isLoading es verdadero
  if (isLoading) {
    return <div>Cargando...</div>;
  }

  return (
    <header className="header">
      <div className="logo">
        <Link to="/categorias" className="nav-link">
          <img src="../resources/img/logo.png" alt="Logo" className="logo-image" />
        </Link>
      </div>
      <nav className="nav">
        {!isAuthenticated ? (
          <>
            <Link to="/login" className="nav-link-n">Iniciar Sesión</Link>
            <Link to="/register" className="nav-link-n">Registrarse</Link>
          </>
        ) : (

          <div className="profile">

            <Link to="/" className={`nav-link ${window.location.pathname === '/' ? 'active' : ''}`}>INICIO</Link>
            <Link to="/categorias" className={`nav-link ${window.location.pathname === '/categorias' ? 'active' : ''}`}>CATEGORÍAS</Link>

            <div
              className="profile-image"
              style={{
                backgroundImage: `url(${user?.profileImage || './resources/img/userImg.png'})`
              }}
              onClick={handleMenuToggle} // Agregar el controlador de eventos para mostrar/ocultar el menú
            />
            {showMenu && ( // Mostrar el menú si showMenu es verdadero
              <div className="profile-menu">

                <p className="label">Nombre</p>
                <p>{`${user?.name} ${user?.surname}`}</p>
                <br />

                <p className="label">Correo electrónico</p>
                <p className="email">{user?.email}</p>
                <br />

                <p className="label">Rol</p>
                <p>{user?.role}</p>

                <button onClick={handleLogout} className="logout-button">Cerrar Sesión</button>

              </div>

            )}
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
