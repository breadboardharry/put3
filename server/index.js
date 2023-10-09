import express from 'express';
import https from 'https';
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import fs from 'fs';
import cors from 'cors';
import Routes from './src/routes/index.js';
import Socket from './src/modules/socket/socket.js';
import dotenv from 'dotenv';
import SocketRoutes from './src/socket/index.js';

// Config .env
dotenv.config({path: process.env.NODE_ENV == 'development' ? '.env.dev' : '.env'});

// Constants and options
const MODE = process.env.NODE_ENV;
const PORT = process.env.PORT || 3000;

// Server options
const servOptions = MODE == 'development' ? {
    key: fs.readFileSync(process.env.SSL_KEY),
    cert: fs.readFileSync(process.env.SSL_CERT),
} : {};

// Cors options - allow requests from any origin
const corsOptions = {
  origin: process.env.CLIENT_ORIGIN,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};
// Server options
const socketOptions = {
  cors: corsOptions,
  path: '/socket/',
}
const app = express();

/* -------------------------------------------------------------------------- */
/*                                HTTPS SERVER                                */
/* -------------------------------------------------------------------------- */

/* ------------------------------ Configuration ----------------------------- */
// Cors
app.use(cors(corsOptions));
// Body limits
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

app.use(cookieParser());

/* ----------------------------------- Setup --------------------------------- */

// Create server
let server;
if (MODE === 'development') server = https.createServer(servOptions, app);
else server = http.createServer(app);

// Log requests
// app.use((req, res, next) => {
//     console.log('Request Origin:', req.headers.origin);
//     console.log('Request Path:', req.path);
//     next();
// });

// Host static files
app.use(express.static('public'));
// Setup routes
app.use('/api/', Routes);

// Welcome message
app.use('/', (req, res) => {
    res.status(200).send(
        `Welcome to PUT3 server!

        MODE: ${process.env.NODE_ENV}
        CORS Origin: ${process.env.CLIENT_ORIGIN}`
    );
})

// Server starting
server.listen(PORT, () => {
    console.log(
        `[*] Server started on port ${PORT}`
    );
});

/* -------------------------------------------------------------------------- */
/*                              WEB SOCKET SERVER                             */
/* -------------------------------------------------------------------------- */

// Server setup
Socket.createServer(server, socketOptions);
SocketRoutes.init();
