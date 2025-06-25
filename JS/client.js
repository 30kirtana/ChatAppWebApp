const socket = io("http://localhost:8000");

// Get DOM elements in respective JS variables.
const form = document.getElementById("send-container");
const messageInput = document.getElementById("messageInp");
const messageContainer = document.querySelector(".container");

// Audio that will play on receiving the messages.
var audio = new Audio('notify.mp3');

// Function which will append event info to the conatiner.
const append = (message, position) => {
  const messageElement = document.createElement("div");
  messageElement.innerText = message;
  messageElement.classList.add("message");
  messageElement.classList.add(position);
  messageContainer.append(messageElement);
  if(position == 'left'){
      audio.play();
  }
};

// If the form gets submitted, send server the message.
form.addEventListener('submit',(e) => {
 e.preventDefault();
 const message = messageInput.value;
 append(`You: ${message}`, 'right');
 socket.emit('send', message);
 messageInput.value = '';
})

// Ask new user for name and let the server know.
const nameUser = prompt("Enter your name to join.");
socket.emit("new-user-joined", nameUser);

// If a new user joins, receive event from the server.
socket.on("user-joined", (name) => {
    append(`${name} joined the chat.`, "right");
});

// If the user sends a message, receive it.
socket.on("receive", (data) => {
    append(`${data.name}: ${data.message}`, "left");
});

// If the user leaves the chat, inform other users.
socket.on("left", (name) => {
    append(`${name} left the chat.`, "right");
});