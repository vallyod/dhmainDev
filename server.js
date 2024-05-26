const express = require('express');
const { createServer } = require('http');
const { join } = require('path');
const { Server } = require('socket.io');

const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(express.static('public'));
app.use(express.static('styles'));

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'pages', 'login.html'));
});

app.get('/game', (req, res) => {
  //res.sendFile('public/FP.html');
  res.sendFile(join(__dirname, 'pages', 'login.html'));
});

app.get('/game', (req, res) => {
  //res.sendFile('public/FP.html');
  res.sendFile(join(__dirname, 'pages', 'login.html'));
});

const clients = new Map();

io.on('connection', (socket) => {
  // Create user
  const user = {
    id: socket.id,
    name: 'placeholder',
    image: 'image placeholder'
  };

  // Add user to clients
  clients.set(user);

  clients.forEach((existingUser) => {
    socket.emit('userJoined', existingUser);
  });

  socket.broadcast.emit('userJoined', user);

  // Handle disconnection
  socket.on('disconnect', () => {
    clients.delete(user);

    io.emit('userDeleted', user);
  });
});

server.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
