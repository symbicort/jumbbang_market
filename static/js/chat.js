// const chatForm = document.getElementById("chat-form");
// const chatMessages = document.querySelector(".talkList");
// const roomName = document.getElementById("room-name");
// const userList = document.getElementById("users");

const { myName } = Qs.parse(location.search, {
    ignoreQueryPrefix: true,
});

const room = document.getElementById("roomid");
const username = myName;

console.log(room, username);

const socket = io();

socket.emit("joinRoom", { username, room });

socket.on("roomFull", () => {
    alert(`채팅방 인원은 최대 2명입니다`);
    socket.disconnect();
    window.history.back();
});

socket.on("roomUsers", ({ room, users }) => {
    outputRoomName(room);
    outputUsers(users);
});

socket.on("message", (message) => {
    console.log(message);
    outputMessage(message);
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

function outputMessage(message) {
    const div = document.createElement("li");
    div.classList.add("message");
    div.innerHTML = `
    <p class="meta">${message.name} <span>${message.time}</span></p>
    <p class="text">${message.text}</p>`;
    document.querySelector("#server-result").appendChild(div);
}

function outputRoomName(room) {
    roomName.innerText = room;
}

function outputUsers(users) {
    userList.innerHTML = `${users
        .map((user) => `<li id=${user.username}>${user.username}</li>`)
        .join("")}`;
}

socket.on("updateUsers", (username) => {
    const deletelist = document.getElementById(`${username}`);
    if (deletelist) {
        deletelist.remove();
    }
});

function exit() {
    console.log("나가기 기능");
    socket.disconnect();
    axios({
        method: "delete",
        url: "",
    });
    window.location.herf = "/getchatrooms";
}

// 채팅 보내기
function send() {
    const msg = document.getElementById("msg");
    console.log(sendid, sendmsg);
    axios({
        method: "post",
        url: "/chatroom/post",
        data: {
            roomid: roomid.value,
            sendmsg: msg.value,
            sendid,
        },
    })
        .then((result) => {
            console.log(result.data);
        })
        .catch((error) => {
            console.log(error);
        });

    sendmsg.value = "";
    sendmsg.focus();

    socket.emit("chatMessage", msg);
}
