const express = require('express');
const app = express();

const http = require('http');
const WebSocket = require('ws');
const bodyParser = require('body-parser');
const cors = require('cors');
const Routes = require('./routes/routes');
const utils = require('./utils/utils');

// Constants and options
const PORT = process.env.PORT || 3000;
const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
};

// Setup servers
const server = http.createServer(app);
const sockets = require('socket.io')(server, {
  cors: corsOptions
});

// Allow requests from any origin
app.use(cors(corsOptions));

// Configure body limits
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

// Routes
app.use('/', Routes);

let users = {};

// Server starting
server.listen(PORT, () => {
  console.log(`[*] Server started on: http://localhost:${PORT}`);

  // setInterval(() => {
  //   console.log('Users: ' + JSON.stringify(users));
  // }, 2000);
});

// On every client connection
sockets.on('connection', socket => {
  console.log('[-] New user connected: ' + socket.id);
  users[socket.id] =  {
    status: 'pending',
  };
  socket.emit('id', socket.id);

  socket.on('disconnect', (data) => {
    console.log('[-] User disconnected: ' + socket.id);
    delete users[socket.id];

    // Send updated fool list
    const foolList = Object.values(utils.toArray(users)).filter(user => user.role == 'fool');
    sockets.emit('foolList', foolList);
  });

  socket.on('role', (role) => {
    console.log('[-] User ' + socket.id + ' selected role ' + role);
    users[socket.id].status = role == 'fool' ? 'editing' : 'active';
    users[socket.id].role = role;

    if (role == 'fool') users[socket.id].name = utils.newName(users);

    // Send updated fool list
    const foolList = Object.values(utils.toArray(users)).filter(user => user.role == 'fool');
    sockets.emit('foolList', foolList);
  });

  socket.on('status', (status) => {
    console.log('[-] User ' + socket.id + ' new status ' + status);
    users[socket.id].status = status;

    // Send updated fool list
    const foolList = Object.values(utils.toArray(users)).filter(user => user.role == 'fool');
    sockets.emit('foolList', foolList);
  });

  socket.on('action', (data) => {
    console.log('[-] Action from ' + socket.id + ' to ' + data.target.id);
    sockets.emit('action', data);
  });
});



