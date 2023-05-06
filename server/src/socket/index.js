import Users from "../modules/users/users.js";
import Socket from "../modules/socket/socket.js";

/**
 * Initialize socket routes
 */
const init = () => {
    // On client connection
    Socket.io.on("connection", (socket) => {
        connection(socket);
        disconnection(socket);
        role(socket);
        status(socket);
        action(socket);
    });
};

// Client connection
const connection = (socket) => {
    console.log("[-] New user connected: " + socket.id);
    Users.new(socket.id);
    socket.emit("id", socket.id);
}

// Client disconnection
const disconnection = (socket) => {
    socket.on("disconnect", (data) => {
        console.log("[-] User disconnected: " + socket.id);
        Users.remove(socket.id);

        // Send updated fool list
        Socket.update.fools();
    });
};

// Client role attribution
const role = (socket) => {
    socket.on("role", (role) => {
        console.log("[-] User " + socket.id + " selected role " + role);
        Users.user(socket.id).newRole(role);

        // Send updated fool list
        Socket.update.fools();
    });
};

// Client status update
const status = (socket) => {
    socket.on("status", (status) => {
        console.log("[-] User " + socket.id + " new status " + status);
        Users.user(socket.id).status = status;

        // Send updated fool list
        Socket.update.fools();
    });
};

// Client interaction
const action = (socket) => {
    socket.on("action", (data) => {
        console.log("[-] Action from " + socket.id + " to " + data.target.id);
        Socket.update.action();
    });
};

const SocketRoutes = { init };

export default SocketRoutes;
