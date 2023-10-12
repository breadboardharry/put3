import { Socket, Server as SocketIOServer } from "socket.io";
import { corsOptions } from "../../config/cors";
import http from 'http';
import https from 'https';
import UserModule from "../../modules/users/users";
import { EnumEventName } from "../../enums/event-name";
import cookieParser from "cookie-parser";
import UserMiddleware from "../../middlewares/user";
import UsersService from "../../services/users/users.service";

export class SocketServer {

    private static options = {
        cors: corsOptions,
        path: '/socket/',
        cookie: true
    };

    private static io: SocketIOServer;
    private static _clients: Map<string, Socket> = new Map<string, Socket>();

    public static init(httpServer: http.Server | https.Server) {
        this.io = new SocketIOServer(httpServer, this.options);

        this.io.engine.use(cookieParser());
        this.io.engine.use(UserMiddleware);

        this.io.on("connection", (socket) => {

            this._clients.set(socket.id, socket);
            UserModule.connect(socket.id);

            socket.on("disconnect", () => {
                UserModule.disconnect(socket.id);
                this._clients.delete(socket.id);
            });

            socket.on(EnumEventName.ROLE, (message) => {
                UserModule.setRole(socket.id, message.data.role, {
                    sessionCode: message.data.sessionCode,
                    preferences: message.data.preferences,
                    isAdmin: socket.request['auth'].isAdmin,
                });
            });

            socket.on(EnumEventName.ACTION, (message) => {
                UserModule.sendAction(socket.id, message.target.uuid, message.data);
            });

            socket.on(EnumEventName.INFOS, (message) => {
                UserModule.changeInfos(socket.id, message.data);
            });

            socket.on(EnumEventName.LAYOUT, (message) => {
                UserModule.changeLayout(socket.id, message.target.uuid, message.data);
            });

            socket.on(EnumEventName.RENAME, (message) => {
                UserModule.rename(socket.id, message.target.uuid, message.data.newName);
            });
        });
    }

    public static get clients(): Map<string, Socket> {
        return this._clients;
    }

    public static emit(key: string, message: any): void {
        this.io.emit(key, message);
    }

}