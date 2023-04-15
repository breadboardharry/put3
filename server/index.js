const express = require('express');
const app = express();
const http = require('http');
const bodyParser = require('body-parser');
const cors = require('cors');
const Routes = require('./routes/routes');

// Constants and options
const PORT = process.env.PORT || 3000;
// Cors options - allow requests from any origin
const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
};

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
const socketOptions = {
  cors: corsOptions,
  path: '/socket/',
}

// Setup server
const io = require('socket.io')(server, socketOptions);

// Setup events
require('./socket')(io);
