const httpServer = require("http").createServer();
const port = 3002;
const axios = require('axios');
const { createMessage } = require('./lib/lib.js');
require('dotenv').config();
const env = process.env;
const api = env.API;
const io = require("socket.io")(httpServer, {
  cors: {
    origin: [env.LOCALADDRESS, env.REMOTEADDRESS],
    methods: ["GET", "POST"]
  }
});

const botName = '-=FamBAM BOT=-';

/*
 *  socket.emit = to the client only
 *  socket.broadcast.emit = to everyone connected BUT the client
 *  io.emit = to everyone
 */
io.on('connection', (socket) => {
  socket.on('joinRoom', ({ roomName, username }) => {
    socket.join(roomName);
    socket.broadcast.to(roomName).emit('chat', createMessage(botName, `${username} has joined the channel`));
  })

  socket.on('chat', ({ newMessage, roomInfo, profile}) => {
    io.in(roomInfo.roomName).emit('chat', newMessage)
    axios.post(`${api}/newMessage?uid=${profile.id}&cid=${roomInfo.id}&un=${newMessage.user_name}&um=${newMessage.user_message}&ts=${newMessage.time_stamp}&da=${newMessage.date}`);
  })
})

httpServer.listen(port, () => {
  console.log(`Chat Server lisening on port ${port}...`)
})