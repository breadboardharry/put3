import { Env } from "./config/env";
Env.init();
import express from "express";
import { HTTPServer } from "./servers/http/http-server";
import { SocketServer } from "./servers/socket/socket-server";

const app = express();
const httpServer = HTTPServer.init(app);
SocketServer.init(httpServer);