const { Server } = require('socket.io');
const  cartSocketListeners  = require('./cartSocketListeners')

let io;

function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  console.log('Socket.IO initialized');

  io.on('connection', (socket) => {
   console.log('A user connected', socket.id)

    cartSocketListeners(socket)

    socket.on('disconnect', () => {
      console.log('A user disconnected:', socket.id);
    });
    
  });
}
const generalErrorHandler = (error) => {
  return io.emit('error', error)
}
const notifyer = (message) => {
  return io.emit('notification', message)
}


module.exports = { initSocket, generalErrorHandler,notifyer};
