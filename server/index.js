import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cors from 'cors';
import Routes from './src/routes/index.js';
import Socket from './src/socket/index.js';
import dotenv from 'dotenv';
dotenv.config();

// Constants and options
const PORT = process.env.PORT || 3000;
// Cors options - allow requests from any origin
const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST'],
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

// Server starting
server.listen(PORT, () => {
  console.log(`[*] Server started on port ${PORT}`);
});

/* -------------------------------------------------------------------------- */
/*                              WEB SOCKET SERVER                             */
/* -------------------------------------------------------------------------- */

// Server options
Socket.createServer(server, socketOptions);
