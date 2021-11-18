const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utls/messages');
const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require('./utls/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);
// set static folder 
app.use(express.static(path.join(__dirname, 'public')));

const botName = 'Chatbot Bot';

// Run when client connects
io.on('connection', socket => {
    socket.on('joinRoom', ({ username, room }) => {
  const user = userJoin(socket.id, username, room);
  
        socket.join(user.room);
        // Welcome current user
    socket.emit('message', formatMessage(botName, 'Welcome to Chatbot!'));

    //Broadcast when a user connects
    socket.broadcast.to(user.room).emit('message',formatMessage(botName,  `${user.username} has joined the chat`));

    // Send users and room info
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomUsers(user.room)
    });
    });

     
  
   // console.log('New WS Connection...');
    
  

    

    //listen for chatMessage
    socket.on('chatMessage', msg => {
        const user = getCurrentUser(socket.id);

        io.to(user.room).emit('message', formatMessage(user.username, msg));
    });

   // Run when client disconnect
  socket.on('disconnect', () => {
     const user = userLeave(socket.id);

     if(user) {

     
     io.to(user.room).emit('message', formatMessage(botName,`${user.username} has left the chat`));

      // send users and room info
   io.to(user.room).emit('roomUsers', {
    room: user.room,
    users: getRoomUsers(user.room)
   });
     }
  });
});
console.log("helllo");
const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => 
    console.log(`server running on port ${PORT}`));