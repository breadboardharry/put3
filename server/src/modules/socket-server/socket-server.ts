import { Server as SocketIOServer } from "socket.io";
import { corsOptions } from "../../config/cors";
import http from 'http';
import https from 'https';
import { ipv6ToIpv4 } from "../../services/ip.service";
import { EnumEventName, UserModule } from "../users/users";

export class SocketServer {

    private static options = {
        cors: corsOptions,
        path: '/socket/',
    };

    private static io: SocketIOServer;

    public static init(httpServer: http.Server | https.Server) {
        this.io = new SocketIOServer(httpServer, this.options);

        UserModule.emitSubject.subscribe((params) => {
            this.io.emit(params.key, params.data);
        });

        this.io.on("connection", (socket) => {
            const ipAddress = ipv6ToIpv4(socket.handshake.address);
            console.log(`Client connected from IP address ${ipAddress}`);

            UserModule.connect(socket.id);

            socket.on("disconnect", () => {
                UserModule.disconnect(socket.id);
            });

            socket.on(EnumEventName.ROLE, (message) => {
                UserModule.changeRole(socket.id, message.data.role, message.data.preferences);
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

}