const users = [];

function userJoin(id, username, chatroom) {
    const user = { id, username, chatroom };
    users.push(user);
    return user;
}

function getCurrentUser(id) {
    return users.find((user) => user.id === id);
}

function userLeave(id) {
    const index = users.findIndex((user) => user.id === id);

    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
}

function getRoomUsers(chatroom) {
    return users.filter((user) => user.chatroom === chatroom);
}
module.exports = {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers,
};
