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
  clients.add(ws)
  console.log("someone joined");
  
  

  ws.on('message', function(msg) {
    const message = JSON.parse(msg)
  });

  ws.on('close', () => {
    clients.delete(ws);
  });
});

app.listen(port, () => {
  console.log(`App open at localhost:${port}`)
})