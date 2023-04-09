const express = require('express');
const app = express();

const http = require('http');
const WebSocket = require('ws');
const bodyParser = require('body-parser');
const cors = require('cors');
const Routes = require('./routes/routes');

// Constants and options
const PORT = process.env.PORT || 3000;
const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
};

// Setup servers
const server = http.createServer(app);
const socket = require('socket.io')(server, {
  cors: corsOptions
});

// Allow requests from any origin
app.use(cors(corsOptions));

// Configure body limits
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

// Routes
app.use('/', Routes);

// Server starting
server.listen(PORT, () => {
  console.log(`[*] Server started on: http://localhost:${PORT}`);
});

// On every client connection
socket.on('connection', socket => {
  console.log('Socket: client connected');
});