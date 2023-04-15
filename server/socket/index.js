const utils = require('./../utils/utils');

let users = {};

/**
 * Get connected fool list
 * @return {Array} Fool list
 */
function foolList () {
  return Object.values(utils.toArray(users)).filter(user => user.role == 'fool')
};

module.exports = (io) => {
  // On client connection
  io.on('connection', socket => {
    console.log('[-] New user connected: ' + socket.id);
    users[socket.id] = {
      status: 'pending',
    };
    socket.emit('id', socket.id);

    // Client disconnection
    socket.on('disconnect', (data) => {
      console.log('[-] User disconnected: ' + socket.id);
      delete users[socket.id];

      // Send updated fool list
      io.emit('foolList', foolList());
    });

    // Client role attribution
    socket.on('role', (role) => {
      console.log('[-] User ' + socket.id + ' selected role ' + role);
      users[socket.id].status = role == 'fool' ? 'editing' : 'active';
      users[socket.id].role = role;

      if (role == 'fool') users[socket.id].name = utils.newName(users);

      // Send updated fool list
      io.emit('foolList', foolList());
    });

    // Client status update
    socket.on('status', (status) => {
      console.log('[-] User ' + socket.id + ' new status ' + status);
      users[socket.id].status = status;

      // Send updated fool list

      io.emit('foolList', foolList());
    });

    // Client interaction
    socket.on('action', (data) => {
      console.log('[-] Action from ' + socket.id + ' to ' + data.target.id);
      io.emit('action', data);
    });
  });
}
