import { Socket, Server as SocketIOServer } from "socket.io";
import { corsOptions } from "../../config/cors";
import http from 'http';
import https from 'https';
import { UserModule } from "../users/users";
import { EnumEventName } from "../../enums/event-name";
import { SessionModule } from "../session/sessions";

export type EmitParams = { key: string, targetIds?: string[], data?: any };

export class SocketServer {

    private static options = {
        cors: corsOptions,
        path: '/socket/',
    };

    private static io: SocketIOServer;
    private static clients: Map<string, Socket> = new Map<string, Socket>();

    public static init(httpServer: http.Server | https.Server) {
        this.io = new SocketIOServer(httpServer, this.options);

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
                        preferences: message.data.preferences
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