const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');

const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(express.static('public'))
app.use(express.static('styles'))

app.get('/', (req, res) => {
  //res.sendFile('public/FP.html');
  res.sendFile(join(__dirname, 'pages', 'game.html'));
});

var clients = new Set()
io.on('connection', (socket) => {
  // Create user
  var user = new Object();
  //user.socket = socket
  user.name = "placeholder"
  user.image = "image placeholder"

  // Tell clients new client joined
  socket.emit("userJoined", user)

  // For recieving answers
  socket.on('answer', function(msg) {
    const message = JSON.parse(msg)
  });

  // Leaving
  socket.on('disconnect', () => {
    socket.emit("userDeleted", user)
  });
});

server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});