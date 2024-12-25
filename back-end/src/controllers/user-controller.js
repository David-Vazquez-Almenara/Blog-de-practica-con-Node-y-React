import User from '../models/user-model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../config.js';



export const register = async (req, res) => {
  const { name, surname, password, email, profileImage } = req.body;
  const emailVerificate = /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/;
  let verification = true;

  try {
    // auth existing User email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      verification = false;
      return res.status(400).json({ message: 'Email already in use' });
    }

    // auth verificate email

    if (!emailVerificate.test(email) || !email) {
      verification = false;
      return res.status(400).json({ message: 'Email format is invalid' });
    }

    if(!profileImage){
      profileImage = "../resources/img/userImg.png";
    }

    // auth verificate UserName
    if (!name) {
      verification = false;
      return res.status(400).json({ message: 'UserName is required' });
    }

    // auth verificate LastName
    if (!surname) {
      verification = false;
      return res.status(400).json({ message: 'lastName is required' });
    }

    // auth verificate password
    if (!password) {
      verification = false;
      return res.status(400).json({ message: 'Password is required' });
    }


    const hashedPassword = await bcrypt.hash(password, 10);

    if (verification) {
      const newUser = new User({
        name,
        surname,
        email,
        password: hashedPassword,
        profileImage,
        role: "cliente"
      });

      await
newUser.save
();

      const existingNewUser = await User.findOne({ email });
      if (existingNewUser) {
        res.status(201).json({ message: 'User created successfully' });
      }

    }

  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


export const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (user) {
      const isPasswordValid = await bcrypt.compare(password, user.password);

        if (isPasswordValid) {
          const token = jwt.sign({ id: user._id, email: user.email }, config.app.secretKey, { expiresIn: '30d' });

          console.log(`El usuario ${email} se ha logueado correctamente`);

          // Devuelve el token, el correo electrónico del usuario y el nombre de la organización
          return res.json({ token, email: user.email });
        } else {
          console.log("No se encontró ningún usuario con el ID:", userId);
        }
      }

  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }

  // Si el usuario no se encuentra o la contraseña no es válida, devuelve un mensaje de error
  return res.status(401).json({ message: 'Credenciales inválidas' });
};



//====================[GET DATA]====================

// Controlador para obtener un usuario por su ID
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params; // Cambiado a 'id' en lugar de 'userId'

    // Buscar el usuario por id, excluyendo la contraseña
    const user = await User.findOne({ _id: id }).select('-password');

    if (!user) {
      console.log("ERROR: No se encontró ningún usuario con la ID proporcionada");
      return res.status(404).json({ message: `No user found with the provided ID. ID provided: ${id}` });
    }
    console.log("Datos del usuario encontrados:\n", user);
    res.status(200).json(user);
  } catch (error) {
    console.log('ERROR: Error al obtener los datos del usuario por ID:\n', error);
    res.status(500).json({ message: 'Error fetching user data by ID' });
  }
};


// Controlador para obtener los datos de un usuario por su email
export const getUserByEmail = async (req, res) => {
  try {
    const { email } = req.params;

    // Buscar el usuario por correo, excluyendo la contraseña
    const user = await User.findOne({ email }).select('-password');

    if (!user) {
      console.log("ERROR: No se encontró ningún usuario con el correo electrónico proporcionado");
    }

    console.log("Datos del usuario encontrados:", user);
    res.status(200).json(user);
  } catch (error) {
    console.log('ERROR: Error al obtener los datos del usuario por correo electrónico', error);
    res.status(500).json({ message: 'Error fetching user data by email' });
  }
};

// Controlador para obtener todos los usuarios
export const getAllUsers = async (req, res) => {
  try {
    // Buscar todos los usuarios, excluyendo la contraseña
    const users = await User.find({}, { password: 0 });

    if (!users || users.length === 0) {
      console.log("ERROR: No se encontró ningún usuario");
      return res.status(404).json({ message: 'No se encontraron usuarios' });
    }

    console.log("Datos de los usuarios encontrados:", users);
    res.status(200).json(users);
  } catch (error) {
    console.log('ERROR: Error al obtener los datos de los usuarios', error);
    res.status(500).json({ message: 'Error fetching users data' });
  }
};


// Controlador para obtener todos los usuarios que no tienen el rol de "cliente"
export const getAllNonClientUsers = async (req, res) => {
  try {
    // Buscar todos los usuarios que no tienen el rol de "cliente", excluyendo la contraseña
    const users = await User.find({ role: { $ne: 'cliente' } }, { password: 0 });

    if (!users || users.length === 0) {
      console.log("ERROR: No se encontró ningún usuario que no sea cliente");
      return res.status(404).json({ message: 'No se encontraron usuarios que no sean clientes' });
    }

    console.log("Datos de los usuarios encontrados:", users);
    res.status(200).json(users);
  } catch (error) {
    console.log('ERROR: Error al obtener los datos de los usuarios que no son clientes', error);
    res.status(500).json({ message: 'Error fetching non-client users data' });
  }
};





//====================[UPDATE DATA]====================

export const updateUserByEmail = async (req, res) => {
  try {
    const { email } = req.params;

    let user = await User.findOne({ email }).select('-password');
    if (!user) {
      console.log("ERROR: No se encontró ningún usuario con el correo electrónico proporcionado");
      return res.status(404).json({ message: `No user found with the provided email. Email provided: ${email}` });
    }


    // Elimina las claves vacías o nulas del cuerpo de la solicitud
    for (const key in req.body) {
      if (req.body[key] === '' || req.body[key] === null) {
        delete req.body[key];
      }
    }

    //Hasheo de la contraseña
    req.body.password = await bcrypt.hash(req.body.password, 10);

    // Elimina las claves que no deben ser actualizadas
    delete req.body.email;

    user = await User.findOneAndUpdate({ email }, { $set: req.body }, { new: true });

    console.log("Usuario actualizado:", user);
    res.status(200).json({ message: "The user data has been updated successfully." });
  } catch (error) {
    console.log('ERROR: Error al actualizar los datos del usuario por correo electrónico', error);
    res.status(500).json({ message: 'Error updating user data by email.' });
  }
};


export const updateUserById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    let user = await User.findOne({ _id: id }).select('-password');
    if (!user) {
      console.log("ERROR: No se encontró ningún usuario con el ID proporcionado");
      return res.status(404).json({ message: `No user found with the provided ID. ID provided: ${id}` });
    }

    // Verificar si la contraseña está presente antes de hashearla
    if (req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, 10);
    }

    // Elimina las claves vacías o nulas del cuerpo de la solicitud
    for (const key in req.body) {
      if (req.body[key] === '' || req.body[key] === null) {
        delete req.body[key];
      }
    }

    // Elimina las claves que no deben ser actualizadas
    delete req.body.email;

    user = await User.findOneAndUpdate({ _id: id }, { $set: req.body }, { new: true });

    console.log("Usuario actualizado:", user);
    res.status(200).json({ message: "The user data has been updated successfully." });
  } catch (error) {
    console.log('ERROR: Error al actualizar los datos del usuario por su ID ', error);
    res.status(500).json({ message: 'Error updating user data by ID.' });
  }
};







//====================[DELETE USER]====================


// Controlador para eliminar un usuario por correo electrónico
export const deleteUserByEmail = async (req, res) => {
  try {
    const { email } = req.params;

    const user = await User.findOneAndDelete({ email });
    if (!user) {
      console.log("ERROR: No se encontró ningún usuario con el correo electrónico proporcionado");
      return res.status(404).json({ message: `No user found with the provided email. Email provided: ${email}` });
    }
    const username = user.username;
    // Verificar si se eliminó un usuario


    // Devolver los datos del usuario eliminado
    console.log(`Usuario eliminado correctamente: ${username}`);
    res.status(200).json({ message: `User deleted successfully: ${username}` });
  } catch (error) {
    console.log('\nERROR: Error al eliminar el usuario por correo electrónico:\n', error);
    res.status(500).json({ message: 'Error deleting user' });
  }
};



