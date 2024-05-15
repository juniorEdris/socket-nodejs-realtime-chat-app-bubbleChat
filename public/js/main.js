const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
const roomName = document.getElementById("room-name");
const userList = document.getElementById("users");

const socket = io();

// get username and room name
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

// Join a room
socket.emit("joinroom", { username, room });

socket.on("message", (message) => {
  outputChatMsg(message);

  //   Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
  chatMessages.appendChild("");
});

chatForm.addEventListener(`submit`, (e) => {
  e.preventDefault();

  // Get message text
  let msg = e.target.elements.msg.value;

  msg = msg.trim();

  if (!msg) {
    return false;
  }

  // Emit message to server
  socket.emit("chatmessage", msg);

  // Clear input
  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
});

const outputChatMsg = (message) => {
  const div = document.createElement("div");
  div.classList.add("message");
  const p = document.createElement("p");
  p.classList.add("meta");
  p.innerText = message.username;
  p.innerHTML += `<span>${message.time}</span>`;
  div.appendChild(p);
  const para = document.createElement("p");
  para.classList.add("text");
  para.innerText = message.text;
  div.appendChild(para);
  document.querySelector(".chat-messages").appendChild(div);
};
