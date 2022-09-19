const httpServer = require("http").createServer();
const port = 3002;
require('dotenv').config();
const io = require("socket.io")(httpServer, {
  cors: {
    origin: ["http://localhost:3000", "http://192.168.1.8:3000", "http://192.168.1.12:*"],
    methods: ["GET", "POST"]
  }
});

/*
 *  socket.emit = to the client only
 *  socket.broadcast.emt = to everyone connected BUT the client
 *  io.emit = to everyone
 */
io.on('connection', (socket) => {
  console.log('Fambam server connection established...');

  socket.emit('message', 'Welcome to FamBAM chat server');

})

httpServer.listen(port, () => {
  console.log(`Chat Server lisening on port ${port}...`)
})