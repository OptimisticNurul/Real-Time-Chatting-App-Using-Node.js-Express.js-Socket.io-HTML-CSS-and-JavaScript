const path = require("path");
const http = require("http");
const express = require("express");
const app = express();
const server = http.createServer(app);
const socketio = require("socket.io");
const io = socketio(server);
const formatMessage = require("./utils/messages");
const {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers,
} = require("./utils/users");

const port = process.env.PORT || 3000;

    app.use(express.static(path.join(__dirname, "public")));

    const botName = "IsDB Chat";

    io.on("connection", (socket) => {
    socket.on("joinRoom", ({ username, chatroom }) => {
        const user = userJoin(socket.id, username, chatroom);
        socket.join(user.chatroom);
        socket.emit("message", formatMessage(botName, "Welcome to IsDBChat"));

        socket.broadcast
            .to(user.chatroom)
            .emit(
                "message",
                formatMessage(botName, `${user.username} has joined the chat!`)
            );

        io.to(user.chatroom).emit("roomUsers", {
            user: user.username,
            chatroom: user.chatroom,
            users: getRoomUsers(user.chatroom),
        });
    });

    socket.on("chatMessage", (msg) => {
        const user = getCurrentUser(socket.id);

        io.to(user.chatroom).emit("message", formatMessage(user.username, msg));
    });

    socket.on("disconnect", () => {
        const user = userLeave(socket.id);

        if (user) {
            io.to(user.chatroom).emit(
                "message",
                formatMessage(botName, `${user.username} has left the chat`)
            );

            io.to(user.chatroom).emit("roomUsers", {
                users: getRoomUsers(user.chatroom),
                chatroom: user.chatroom,
            });
        }
    });
});

server.listen(port, () => console.log(`Listening on port ${port}`));
