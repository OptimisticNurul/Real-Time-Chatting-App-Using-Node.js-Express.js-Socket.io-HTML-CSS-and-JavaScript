const socket = io();
const chatForm = document.querySelector(".chat-form");
const messages = document.querySelector("#messages");

const params = new URLSearchParams(window.location.search);
const username = params.get("username");
const chatroom = params.get("chatroom");

socket.emit("joinRoom", { username, chatroom });

socket.on("roomUsers", ({ user, users, chatroom }) => {
    const totalUsers = document.querySelector("#users");
    const roomName = document.querySelector(".room-name");

roomName.innerHTML = chatroom;

totalUsers.innerHTML = "";

for (let user of users) {
        let listItem = document.createElement("li");
        listItem.innerText = user.username;
        totalUsers.append(listItem);
    }
});

const outputMessage = (msg) => {
    const div = document.createElement("div");
    div.setAttribute("class", `message ${msg.username === username ? 'self' : 'other'}`);

    const p1 = document.createElement("p");
    p1.innerText = `${msg.username} ${msg.time}`;

    const p2 = document.createElement("p");
    p2.innerText = msg.text;

    div.append(p1);
    div.append(p2);
    messages.append(div);
};

socket.on("message", (message) => {
    outputMessage(message);
    messages.scrollTop = messages.scrollHeight;
});

chatForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const inputText = document.querySelector("#msg");
    const message = e.target.elements.msg.value;

socket.emit("chatMessage", message);

inputText.value = "";
inputText.focus();
});

document.querySelector('.chat-form').addEventListener('submit', function (event) {
    event.preventDefault();
});
