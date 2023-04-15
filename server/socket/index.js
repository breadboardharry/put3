module.exports = (io) => {

  // On every client connection
  io.on('connection', socket => {
    console.log('[-] New user connected: ' + socket.id);
    users[socket.id] = {
      status: 'pending',
    };
    socket.emit('id', socket.id);

    socket.on('disconnect', (data) => {
      console.log('[-] User disconnected: ' + socket.id);
      delete users[socket.id];

      // Send updated fool list
      const foolList = Object.values(utils.toArray(users)).filter(user => user.role == 'fool');
      sockets.emit('foolList', foolList);
    });

    socket.on('role', (role) => {
      console.log('[-] User ' + socket.id + ' selected role ' + role);
      users[socket.id].status = role == 'fool' ? 'editing' : 'active';
      users[socket.id].role = role;

      if (role == 'fool') users[socket.id].name = utils.newName(users);

      // Send updated fool list
      const foolList = Object.values(utils.toArray(users)).filter(user => user.role == 'fool');
      sockets.emit('foolList', foolList);
    });

    socket.on('status', (status) => {
      console.log('[-] User ' + socket.id + ' new status ' + status);
      users[socket.id].status = status;

      // Send updated fool list
      const foolList = Object.values(utils.toArray(users)).filter(user => user.role == 'fool');
      sockets.emit('foolList', foolList);
    });

    socket.on('action', (data) => {
      console.log('[-] Action from ' + socket.id + ' to ' + data.target.id);
      sockets.emit('action', data);
    });
  });
}
