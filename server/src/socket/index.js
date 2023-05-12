import Users from "../modules/users/users.js";
import Socket from "../modules/socket/socket.js";
import Utils from "../utils/utils.js";

/**
 * Initialize socket routes
 */
const init = () => {
    // On client connection
    Socket.io.on("connection", (socket) => {
        const ipAddress = Utils.ipv6ToIpv4(socket.handshake.address);
        console.log(`Client connected from IP address ${ipAddress}`);

        connection(socket);
        disconnection(socket);
        role(socket);
        action(socket);
        infos(socket);
        desktop(socket);
        layout(socket);
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
const infos = (socket) => {
    socket.on("infos", (data) => {
        console.log("[-] Infos changed for " + socket.id);
        Users.user(socket.id).infos = {...Users.user(socket.id).infos, ...data};
        // Send updated fool list
        Socket.update.fools();
    });
};

// Fool desktop retrieved from cookies
const desktop = (socket) => {
    socket.on("desktop", (data) => {
        console.log("[-] Desktop retrived from cookies by " + socket.id);
        Users.user(socket.id).data.desktop = data;
        // Send updated fool list
        Socket.update.fools();
    });
};

const layout = (socket) => {
    socket.on("layout", (data) => {
        console.log("[-] Layout changed for " + data.target.id + " by " + socket.id);
        Socket.update.layout(data);

        // Update user desktop
        Users.user(data.target.id).data.desktop = data.layout.desktop;

        // Send updated fool list
        Socket.update.fools();
    });
};

const SocketRoutes = { init };

export default SocketRoutes;
