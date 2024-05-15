const path = require(`path`);
const http = require(`http`);

const express = require(`express`);
const socketio = require("socket.io");
const formatMessage = require("./public/utils/message");
const { userJoin, getCurrentUser } = require("./public/utils/user");
const app = express();

const server = http.createServer(app);
const io = socketio(server);

// SET STATIC CLIENT FOLDER
app.use(express.static(path.join(__dirname, `public`)));

const botName = `Chatbot`;

io.on("connection", (socket) => {
  // on join room
  socket.on("joinroom", ({ username, room }) => {
    // Make a user join
    const user = userJoin(socket?.id, username, room);
    socket.join(user.room);

    // Welcome current user
    socket.emit("message", formatMessage(botName, `Welcome to Chat!`));

    // BroadCast when a user connects
    socket.broadcast.emit(
      "message",
      formatMessage(botName, `${username} joined the chat`),
    );
  });

  // Listen for chatmessage
  socket.on("chatmessage", (msg) => {
    const user = getCurrentUser(socket.id);
    io.emit("message", formatMessage(user.username, msg));
  });

  //   Runs when a user disconnects
  socket.on("disconnect", () => {
    io.emit("message", formatMessage(botName, `A User has left the chat!`));
  });
});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Started At Port ${PORT}`));
