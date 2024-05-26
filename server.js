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
  //res.sendFile('public/FP.html');
  res.sendFile(join(__dirname, 'pages', 'game.html'));
});

const clients = new Set();

io.on("connection", (socket) => {
  // Create user
  const user = {
    name: 'None Given',
    points: 0
  };

  socket.on("newUser", (name) => { 
    user.name = name

    clients.add(user);

    clients.forEach((existingUser) => {
      socket.emit('userJoined', existingUser);
    });

    socket.broadcast.emit('userJoined', user);
  })

  socket.on('disconnect', () => {
    clients.delete(user);
  
    io.emit('userDeleted', user);
  });
})

server.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});