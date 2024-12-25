import app from './app.js';
import config from './config.js';
import connectDB from './services/database/dbConfig.js';
import dotenv from 'dotenv';
import http from 'http';

const { port } = config;
dotenv.config();

connectDB();

const server = http.createServer(app); // Crea el servidor HTTP utilizando Express

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
