import { Server } from "socket.io";
import Users from "../users/users.js";
import Resources from "../resources/resources.js";

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
        io.emit('event', { type: 'resources', resources: Resources.getData()});
    },
    fools: () => {
        io.emit('foolList', Users.getFools());
    },
    action: (data) => {
        io.emit('action', data);
    },
    layout: (data) => {
        io.emit('layout', data);
    },
    name: (data) => {
        io.emit('name', data);
    }
}

const SocketModule = {
    createServer,
    update,
    get io() { return io; }
};

export default SocketModule;
