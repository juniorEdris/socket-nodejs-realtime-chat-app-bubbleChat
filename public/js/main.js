const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
const roomName = document.getElementById("room-name");
const userList = document.getElementById("users");
const activity = document.querySelector(".activity");
const msgInput = chatForm.elements.msg;

const socket = io();

// get username and room name
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

// Join a room
socket.emit("joinroom", { username, room });

// Set activity msg
msgInput.addEventListener("keypress", () => {
  socket.emit("activity", username);
});

// update room name and user list
socket.on("roomUsers", ({ room, users }) => {
  console.log({ room, users });
  roomName.innerText = room;
  outputUsersList(users);
});

let activityTimer;
socket.on("activity", (name) => {
  activity.innerHTML = `<p><span class="username">${name}</span> is typing...</p>`;

  // Clear after 1 seconds
  clearTimeout(activityTimer);
  activityTimer = setTimeout(() => {
    activity.innerHTML = "";
  }, 1500);
});

socket.on("message", (message) => {
  activity.innerHTML = "";
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
  p.innerHTML += ` <span>${message.time}</span>`;
  div.appendChild(p);
  const para = document.createElement("p");
  para.classList.add("text");
  para.innerText = message.text;
  div.appendChild(para);
  document.querySelector(".chat-messages").appendChild(div);
};

const outputUsersList = (users = []) => {
  if (!users.length) {
    return;
  }

  userList.innerHTML = `${users
    .map((item) => `<li>${item?.username}</li>`)
    .join("")}`;
  // users.forEach((item) => {
  //   // const li = document.createElement("li");
  //   // li.textContent = item.username;
  //   // userList.appendChild(li);

  // });
};
