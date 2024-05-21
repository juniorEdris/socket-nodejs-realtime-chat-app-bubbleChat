const path = require(`path`);

const express = require(`express`);
const { Server } = require("socket.io");
const formatMessage = require("./public/utils/message");
const { userJoin, getCurrentUser } = require("./public/utils/user");
const app = express();

// SET STATIC CLIENT FOLDER
app.use(express.static(path.join(__dirname, `public`)));

const PORT = process.env.PORT || 3500;

const server = app.listen(PORT, () => console.log(`Started At Port ${PORT}`));

// const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin:
      process.env.NODE_ENV === "production" ? false : ["http//:localhost:3000"],
  },
});

const botName = `Chatbot`;

io.on("connection", (socket) => {
  console.log("socket user", socket.id);
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

  // Listen for activity
  socket.on("activity", (name) => {
    socket.broadcast.emit("activity", name);
  });

  //   Runs when a user disconnects
  socket.on("disconnect", () => {
    io.emit("message", formatMessage(botName, `A User has left the chat!`));
  });
});
