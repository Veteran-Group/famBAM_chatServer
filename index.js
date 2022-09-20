const httpServer = require("http").createServer();
const port = 3002;
const axios = require('axios');
require('dotenv').config();
const env = process.env;
const io = require("socket.io")(httpServer, {
  cors: {
    origin: [env.LOCALADDRESS, env.REMOTEADDRESS],
    methods: ["GET", "POST"]
  }
});

/*
 *  socket.emit = to the client only
 *  socket.broadcast.emit = to everyone connected BUT the client
 *  io.emit = to everyone
 */
io.on('connection', (socket) => {

  socket.on('chat', (messagePack) => {
    let newMessage = messagePack.newMessage;
    let roomInfo = messagePack.roomInfo;
    let profile = messagePack.profile;
    let api = process.env.API;
    io.emit('chat', newMessage);

    axios.post(`${api}/newMessage?uid=${profile.id}&cid=${roomInfo.id}&un=${newMessage.user_name}&um=${newMessage.user_message}&ts=${newMessage.time_stamp}&da=${newMessage.date}`);
  })

  socket.emit('message', 'Welcome to FamBAM chat server');

})

httpServer.listen(port, () => {
  console.log(`Chat Server lisening on port ${port}...`)
})