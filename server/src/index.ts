import express from "express";
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import { HTTPServer } from "./modules/http-server/http-server";
import { corsOptions } from "./config/cors";
import { SocketServer } from "./modules/socket-server/socket-server";

const app = express();

app.use(cors(corsOptions));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use(cookieParser());
app.use(express.static('public'));

const httpServer = HTTPServer.init(app);
SocketServer.init(httpServer);
