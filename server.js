const path = require(`path`);
const http = require(`http`);

const express = require(`express`);
const socketio = require("socket.io");
const app = express();

const server = http.createServer(app);
const io = socketio(server);

/**
 * 
 * const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
io.on('connection', () => { });
 */

// SET STATIC FOLDER
app.use(express.static(path.join(__dirname, `public`)));

io.on("connection", (socket) => {
  // Welcome current user
  socket.emit("message", `Welcome to Chat!`);

  // BroadCast when a user connects
  socket.broadcast.emit("message", `A user has joined the chat`);

  //   Runs when a user disconnects
  socket.on("disconnect", () => {
    io.emit("message", `A user has left the chat!`);
  });

  // Listen for chatmessage
  socket.on("chatmessage", (msg) => {
    io.emit("message", msg);
  });
});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Started At Port ${PORT}`));
