const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
const roomName = document.getElementById("room-name");
const userList = document.getElementById("users");

const socket = io();

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

const outputChatMsg = (msg) => {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `<p class='text'>${msg}</p>`;
  chatMessages.appendChild(div);
};
