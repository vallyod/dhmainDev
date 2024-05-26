const express = require('express')

const app = express()
const port = 3000

const expressWs = require('express-ws')(app)

app.use(express.static('public'))

var clients = new Set()

app.get('/',  (req, res) => {
    res.sendFile('public/index.html');
})

app.ws('/socket', function(ws, req) {
  // Create user
  var user = new Object();
  user.webSocket = ws
  user.name = "placeholder"
  user.image = "image placeholder"
  user.removing = false

  // Tell clients new client joined
  for (const client of clients) {
    client.webSocket.send(user)
  }

  // Add new client to clients
  clients.add(user)

  // For recieving answers
  ws.on('message', function(msg) {
    const message = JSON.parse(msg)
  });

  // Leaving
  ws.on('close', () => {
    clients.delete(object);
    user.removing = true

    for (const client of clients) {
      client.send(user)
    }  
  });
});

app.listen(port, () => {
  console.log(`App open at localhost:${port}`)
})