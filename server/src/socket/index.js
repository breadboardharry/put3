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
        action(socket);
        window(socket);
        hitboxes(socket);
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

// Client interaction
const action = (socket) => {
    socket.on("action", (data) => {
        console.log("[-] Action from " + socket.id + " to " + data.target.id);
        Socket.update.action(data);
    });
};

// Client window change
const window = (socket) => {
    socket.on("window", (data) => {
        console.log("[-] Window changed from " + socket.id + " to width: " + data.width + ", height: " + data.height);
        Users.user(socket.id).data.window = data;

        // Send updated fool list
        Socket.update.fools();
    });
}

const hitboxes = (socket) => {
    socket.on("hitboxes", (data) => {
        console.log("[-] Hitboxes set recieved from " + socket.id + " to " + data.target.id);
        Socket.update.hitboxes(data);
    });
}

const SocketRoutes = { init };

export default SocketRoutes;
