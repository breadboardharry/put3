import { Server } from "socket.io";
import { corsOptions } from "../../config/cors";
import { Express } from "express";
import http from 'http';
import https from 'https';
import { ipv6ToIpv4 } from "../../services/ip.service";
import { getData } from "../resources/resources";
import Users from "../../models/users";

export class SocketServer {

    private static options = {
        cors: corsOptions,
        path: '/socket/',
    };

    private static app: Express;
    private static server: any;
    private static io: Server;

    public static init(app: Express, httpServer: http.Server | https.Server) {
        this.app = app;
        this.io = new Server(httpServer, this.options);
        this.io.on("connection", (socket) => {
            const ipAddress = ipv6ToIpv4(socket.handshake.address);
            console.log(`Client connected from IP address ${ipAddress}`);

            this.connection(socket);
            this.disconnection(socket);
            this.role(socket);
            this.action(socket);
            this.infos(socket);
            this.layout(socket);
            this.rename(socket);
        });
    }

    // Client connection
    private static connection(socket) {
        console.log("[-] New user connected: " + socket.id);
        Users.new(socket.id);
        socket.emit("id", socket.id);
    }

    // Client disconnection
    private static disconnection(socket) {
        socket.on("disconnect", (data) => {
            console.log("[-] User disconnected: " + socket.id);
            Users.remove(socket.id);

            // Send updated fool list
            this.update.fools();
        });
    };

    /**
     * Client select role
     */
    private static role(socket) {
        socket.on("role", (data) => {
            console.log("[-] User " + socket.id + " selected role " + data.role);
            Users.get(socket.id)!.setRole(data.role, data.preferences);

            // Send updated fool list
            this.update.fools();
        });
    };

    /**
     * Master send action to fool
     */
    private static action(socket) {
        socket.on("action", (data) => {
            console.log("[-] Action from " + socket.id + " to " + data.target.id);
            this.update.action(data);
        });
    };

    private static infos(socket) {
        socket.on("infos", (data) => {
            console.log("[-] Infos changed for " + socket.id);
            Users.get(socket.id)!.infos = {...Users.get(socket.id)!.infos, ...data};
            // Send updated fool list
            this.update.fools();
        });
    };

    /**
     * Master change fool layout
     */
    private static layout = (socket) => {
        socket.on("layout", (data) => {
            console.log("[-] Layout changed for " + data.target.id + " by " + socket.id);
            this.update.layout(data);

            // Update user desktop
            Users.get(data.target.id)!.desktop = data.layout.desktop;

            // Send updated fool list
            this.update.fools();
        });
    };


    /**
     * Master rename fool
     */
    private static rename = (socket) => {
        socket.on("rename", (data) => {
            if (!Users.exists(data.target.id)) {
                console.log("[!] User " + data.target.id + " doesn't exist");
                return;
            };

            console.log("[-] Rename " + data.target.name + " (" + data.target.id + ") to " + data.name);
            // Update name
            Users.get(data.target.id)!.name = data.name;

            this.update.name(data);

            // Send updated fool list
            this.update.fools();
        });
    };

    public static update = {
        resources: () => {
            this.io.emit('event', { type: 'resources', resources: getData()});
        },
        fools: () => {
            this.io.emit('foolList', Users.getFools());
        },
        action: (data) => {
            this.io.emit('action', data);
        },
        layout: (data) => {
            this.io.emit('layout', data);
        },
        name: (data) => {
            this.io.emit('name', data);
        }
    }

}