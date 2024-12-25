import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../elements/header.js';
import axios from 'axios';
import '../css/clients.css'; // Asegúrate de tener un archivo CSS para los estilos específicos

const Clients = () => {
  const [clients, setClients] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        // Obtener el token del localStorage
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login'); // Redirigir al usuario a la página de login si no hay token
          return;
        }

        // Obtener la ID del usuario utilizando el token
        const response = await axios.get(`http://localhost:8080/getID/token/${token}`);
        const userId = response.data.userId;

        // Obtener el usuario utilizando la ID
        const userResponse = await axios.get(`http://localhost:8080/user/data/id/${userId}`);
        const userRole = userResponse.data.role;

        if (userRole !== 'ceo') {
          navigate('/categorias'); // Redirigir al usuario a la página de categorías si no es CEO
          return;
        }

        // Si el usuario es CEO, obtener y mostrar los clientes
        const clientsResponse = await axios.get('http://localhost:8080/user/data/all/');
        setClients(clientsResponse.data);
      } catch (error) {
        console.error('Error fetching clients:', error);
      }
    };

    fetchUserInfo();
  }, [navigate]);

  const handleRoleUpdate = async (clientId, newRole) => {
    try {
      await axios.put(`http://localhost:8080/user/update/id/${clientId}`, { role: newRole });
      const updatedClients = clients.map(client => {
        if (client._id === clientId) {
          return { ...client, role: newRole };
        }
        return client;
      });
      setClients(updatedClients);
    } catch (error) {
      console.error('Error updating client role:', error);
    }
  };

  // Agrupar clientes por rol
  const groupedClients = clients.reduce((acc, client) => {
    if (!acc[client.role]) {
      acc[client.role] = [];
    }
    acc[client.role].push(client);
    return acc;
  }, {});

  return (
    <div className="container">
      <Header />
      <div className="clients-container">
        {Object.keys(groupedClients).map(role => (
          <div key={role}>
            <h2>{role.toUpperCase()}</h2>
            <div className="role-group">
              {groupedClients[role].map(client => (
                <div key={client._id} className="user-card">
                  <img src={client.profileImage} alt="Profile" className="profile-image-clients" />
                  <p>{client.name} {client.surname}</p>
                  <p>{client.email}</p>
                  {client.role === 'cliente' && (
                    <button onClick={() => handleRoleUpdate(client._id, 'empleado')} className='contratar'>CONTRATAR</button>
                  )}
                  {client.role === 'empleado' && (
                    <button onClick={() => handleRoleUpdate(client._id, 'cliente')} className='despedir'>DESPEDIR</button>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Clients;
