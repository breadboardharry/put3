import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cors from 'cors';
import Routes from './src/routes/index.js';
import Socket from './src/modules/socket/socket.js';
import dotenv from 'dotenv';
import SocketRoutes from './src/socket/index.js';
dotenv.config();

// Constants and options
const PORT = process.env.PORT || 3000;
// Cors options - allow requests from any origin
const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
};
// Server options
const socketOptions = {
  cors: corsOptions,
  path: '/socket/',
}
const app = express();

/* -------------------------------------------------------------------------- */
/*                                 HTTP SERVER                                */
/* -------------------------------------------------------------------------- */

/* ------------------------------ Configuration ----------------------------- */
// Cors
app.use(cors(corsOptions));
// Body limits
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

/* ----------------------------------- Setup --------------------------------- */
// Create server
const server = http.createServer(app);

// Setup routes
app.use('/', Routes);
// Host static files
app.use(express.static('public'));

// Server starting
server.listen(PORT, () => {
  console.log(`[*] Server started on port ${PORT}`);
});

/* -------------------------------------------------------------------------- */
/*                              WEB SOCKET SERVER                             */
/* -------------------------------------------------------------------------- */

// Server setup
Socket.createServer(server, socketOptions);
SocketRoutes.init();
