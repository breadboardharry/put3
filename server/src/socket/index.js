import { Server } from "socket.io";
import utils from "./../utils/utils.js";
import UserModule from "../modules/users.js";

let users = {};
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
    users[socket.id] = {
      status: "pending",
    };
    socket.emit("id", socket.id);

    // Client disconnection
    socket.on("disconnect", (data) => {
      console.log("[-] User disconnected: " + socket.id);
      delete users[socket.id];

      // Send updated fool list
      io.emit("foolList", UserModule.foolList(users));
    });

    // Client role attribution
    socket.on("role", (role) => {
      console.log("[-] User " + socket.id + " selected role " + role);
      users[socket.id].status = role == "fool" ? "editing" : "active";
      users[socket.id].role = role;

      if (role == "fool") users[socket.id].name = utils.newName(users);

      // Send updated fool list
      io.emit("foolList", UserModule.foolList(users));
    });

    // Client status update
    socket.on("status", (status) => {
      console.log("[-] User " + socket.id + " new status " + status);
      users[socket.id].status = status;

      // Send updated fool list

      io.emit("foolList", UserModule.foolList(users));
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
