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
let chatLog = [];

/*
 *  socket.emit = to the client only
 *  socket.broadcast.emit = to everyone connected BUT the client
 *  io.emit = to everyone
 */
io.on('connection', (socket) => {
  socket.on('joinRoom', ({ newMessage, roomInfo, profile}) => {
    socket.join(roomInfo.roomName);
    let botMessage = createMessage(botName, `${newMessage.user_name} has joined the channel`);
    //chatLog.push(botMessage);
    socket.broadcast.to(roomInfo.roomName).emit('chat', botMessage);
    socket.to(roomInfo.roomName).emit(`Welcome, ${newMessage.user_name}} to the '${roomInfo.roomName}' Room.`)
    // Setup to log the bot messages to the database -> errors to correct first
    //axios.post(`${api}/newMessage?uid=1337&cid=${roomInfo.id}&un=${botMessage.user_name}&um=${botMessage.user_message}&ts=${botMessage.time_stamp}&da=${botMessage.date}`);
  })

  socket.on('chat', ({ newMessage, roomInfo, profile}) => {
    //chatLog.push(newMessage)
    io.in(roomInfo.roomName).emit('chat', newMessage)
    axios.post(`${api}/newMessage?uid=${profile.id}&cid=${roomInfo.id}&un=${newMessage.user_name}&um=${newMessage.user_message}&ts=${newMessage.time_stamp}&da=${newMessage.date}`);
  })
})

httpServer.listen(port, () => {
  console.log(`Chat Server lisening on port ${port}...`)
})