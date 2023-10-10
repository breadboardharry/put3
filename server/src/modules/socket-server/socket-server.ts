import { Socket, Server as SocketIOServer } from "socket.io";
import { corsOptions } from "../../config/cors";
import http from 'http';
import https from 'https';
import { UserModule } from "../users/users";
import { EnumEventName } from "../../enums/event-name";
import { SessionModule } from "../session/sessions";
import { AuthModule } from "../auth/auth";
import AuthMiddleware from "../../middlewares/auth";
import { parse } from "cookie";
import cookieParser from "socket.io-cookie-parser";

export type EmitParams = { key: string, targetIds?: string[], data?: any };

export class SocketServer {

    private static options = {
        cors: corsOptions,
        path: '/socket/',
        cookie: true
    };

    private static io: SocketIOServer;
    private static clients: Map<string, Socket> = new Map<string, Socket>();

    public static init(httpServer: http.Server | https.Server) {
        this.io = new SocketIOServer(httpServer, this.options);
        this.io.use(cookieParser());
        // this.io.use(this.toSocketMiddleware(AuthMiddleware));
        this.io.use(async (socket, next) => {
            console.log(socket.request['cookies']);
            const token = socket.request['cookies'].token;
            const isLogged = await AuthModule.isLogged(token);
            socket.request['isLogged'] = isLogged;
            next();
        });

        UserModule.emitSubject.subscribe((params) => {
            this.emit(params);
        });
        SessionModule.emitSubject.subscribe((params) => {
            this.emit(params);
        });

        this.io.on("connection", (socket) => {
            this.clients.set(socket.id, socket);
            UserModule.connect(socket.id);

            socket.on("disconnect", () => {
                UserModule.disconnect(socket.id);
                this.clients.delete(socket.id);
            });

            socket.on(EnumEventName.ROLE, (message) => {
                setTimeout(() => {
                    UserModule.setRole(socket.id, message.data.role, {
                        sessionCode: message.data.sessionCode,
                        preferences: message.data.preferences,
                        isAdmin: socket.request['isLogged']
                    });
                }, 1000);
            });

            socket.on(EnumEventName.ACTION, (message) => {
                UserModule.sendAction(message.target.uuid, message.data);
            });

            socket.on(EnumEventName.INFOS, (message) => {
                UserModule.changeInfos(socket.id, message.data);
            });

            socket.on(EnumEventName.LAYOUT, (message) => {
                UserModule.changeLayout(message.target.uuid, message.data);
            });

            socket.on(EnumEventName.RENAME, (message) => {
                UserModule.rename(message.target.uuid, message.data.newName);
            });
        });
    }

    /**
     * Emit an event to all clients or to a specific client
     * @param params Emit parameters
     */
    private static emit(params: EmitParams): void {
        if (!params.targetIds || params.targetIds.length == 0) {
            this.io.emit(params.key, params.data);
            return;
        }

        for (const targetId of params.targetIds) {
            const client = this.clients.get(targetId);
            if (!client) {
                console.error(`Socket ${targetId} not found`);
                return;
            }
            client.emit(params.key, params.data);
        }
    }

}