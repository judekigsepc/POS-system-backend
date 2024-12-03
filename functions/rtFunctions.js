const { Server } = require('socket.io');
const { calculateTotals } = require('./calculate')

let io;

function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: 'http://localhost:5173',
      methods: ['GET', 'POST'],
    },
  });

  console.log('Socket.IO initialized');

  io.on('connection', (socket) => {
   console.log('A user connected', socket.id)

    calculateTotals(socket)

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
