import React, { useEffect, useState } from 'react';
import Header from '../elements/header.js';
import '../css/employers.css'; // Asegúrate de tener un archivo CSS para los estilos específicos

async function getAllUsers() {
  try {
    const response = await fetch('http://localhost:8080/user/data/notClient/');
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const users = await response.json();
    return users;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
}

const Employees = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersData = await getAllUsers();
        setUsers(usersData);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    
    fetchUsers();
  }, []);

  const groupedUsers = users.reduce((acc, user) => {
    if (!acc[user.role]) {
      acc[user.role] = [];
    }
    acc[user.role].push(user);
    return acc;
  }, {});

  return (
    <div className="container">
      <Header />
      <div className="employees-container">
        {Object.keys(groupedUsers).map(role => (
          <div key={role}>
            <h2>{role.toUpperCase()}</h2>
            <div className="role-group">
              {groupedUsers[role].map(user => (
                <div key={user.name + user.surname} className="user-card">
                  <img src={user.profileImage} alt='' className="profile-image-employers"/>
                  <p>{user.name} {user.surname}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Employees;
