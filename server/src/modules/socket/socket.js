import { Server } from "socket.io";
import Users from "../users/users.js";

let io;

/**
 * Create a new socket server
 * @param {http.Server} httpServer
 * @param {object} options
 */
const createServer = (httpServer, options) => {
    console.log("[*] Socket server started");
    io = new Server(httpServer, options);
};

const update = {
    resources: () => {
        io.emit('event', { type: 'resources' });
    },
    fools: () => {
        io.emit('foolList', Users.getFools());
    },
    action: (data) => {
        io.emit('action', data);
    }
}

const SocketModule = {
    createServer,
    update,
    get io() { return io; }
};

export default SocketModule;
