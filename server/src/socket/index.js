import { Server } from "socket.io";
import utils from "./../utils/utils.js";
import Users from "../modules/users.js";

let io;

const createServer = (httpServer, options) => {
  console.log("[*] Socket server started");
  io = new Server(httpServer, options);
  init();
};

const init = () => {
  // On client connection
  io.on("connection", (socket) => {
    console.log("[-] New user connected: " + socket.id);

    Users.new(socket.id);

    socket.emit("id", socket.id);

    // Client disconnection
    socket.on("disconnect", (data) => {
      console.log("[-] User disconnected: " + socket.id);
      Users.remove(socket.id);

      // Send updated fool list
      io.emit("foolList", Users.getFools());
    });

    // Client role attribution
    socket.on("role", (role) => {
      console.log("[-] User " + socket.id + " selected role " + role);
      Users.user(socket.id).newRole(role);

      // Send updated fool list
      io.emit("foolList", Users.getFools());
    });

    // Client status update
    socket.on("status", (status) => {
      console.log("[-] User " + socket.id + " new status " + status);
      Users.user(socket.id).status = status;

      // Send updated fool list
      io.emit("foolList", Users.getFools());
    });

    // Client interaction
    socket.on("action", (data) => {
      console.log("[-] Action from " + socket.id + " to " + data.target.id);
      io.emit("action", data);
    });
  });
};

const SocketModule = {
  createServer
};

export default SocketModule;
