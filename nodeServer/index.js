// // Node Server which will handle socket io connections.
// // Access-Control-Allow-Origin: http://localhost:5500;

/* Not correct code
const { serverOne } = require('socket.io')(8000);
const users = {};
const express = require('express');
const http = require('http');

const app = express();
const server = http.createServer(app);

// Allow CORS for localhost:3000 (frontend)
const io = new Server(server, {
  cors: {
    origin: "http://127.0.0.1:5500",
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});

ioServer.on('connection', socket => {
    socket.on('new-user-joined', name =>{
        console.log("New user", name);
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
    })

    socket.on('send',message =>{
        socket.broadcast.emit('receive', {message: message, name: user[socket.id]});
    })
})
*/

// Node Server which will handle socket.io connections

const express = require('express');
const http = require('http');
const { Server } = require('socket.io'); // Fix import

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://127.0.0.1:5500", // This is the client
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});

const users = {};

io.on('connection', socket => {
  // If new user joined, let other users connected to server know.
  socket.on('new-user-joined', name => {
    // console.log("New user:", name);
    users[socket.id] = name;
    socket.broadcast.emit('user-joined', name);
  });

  // If someone sends a message, broadcast it to other people. 
  socket.on('send', message => {
    socket.broadcast.emit('receive', { message: message, name: users[socket.id] });
  });


  // If someone leaves the ChatApp, let other users know.
  /* socket.on('disconnect', () => {
    socket.broadcast.emit('user-left', users[socket.id]);
    delete users[socket.id];
  }); */
   socket.on('disconnect', message => {
    socket.broadcast.emit('left', users[socket.id]);
    delete users[socket.id];
  });


});

// Start server on port 8000
server.listen(8000, () => {
//   console.log('Socket.IO server running on http://localhost:8000');
});
