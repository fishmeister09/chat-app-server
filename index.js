const express = require('express');
const app = express();
const http = require('http');
// const cors = require('cors');
const { Server } = require('socket.io');

// const corsOpts = {
//   origin: '*',

//   methods: ['GET', 'POST'],

//   allowedHeaders: ['Content-Type'],
// };
// app.use(cors(corsOpts));
app.use(function (req, res, next) {
  res.setHeader(
    'Access-Control-Allow-Origin',
    'https://chat-app-q9tg.vercel.app/'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-Requested-With,content-type'
  );
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});
app.get('/', (req, res) => {
  res.send('<h1>Hey Socket.io</h1>');
});
const server = http.createServer(app);

const io = new Server(server);
let users = [];
var removeUser = (userId) =>
  users.find((u, i) => u.ID == userId && users.splice(i, 1));

io.on('connection', (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on('join_room', (data) => {
    const { username, room } = data;
    users.push({ ID: socket.id, username: username, room: room });
    socket.join(room);
    console.log(`User with ID: ${socket.id} joined room: ${room}`);
  });

  socket.on('send_message', (data) => {
    socket.to(data.room).emit('receive_message', data);
  });

  socket.on('getusers', () => {
    socket.emit('users', users);
  });

  socket.on('disconnect', () => {
    removeUser(socket.id);
    console.log('User Disconnected', socket.id);
  });
});

server.listen(3001, () => {
  console.log('SERVER RUNNING');
});
