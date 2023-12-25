// const chatForm = document.getElementById("chat-form");
// const chatMessages = document.querySelector(".talkList");
// const roomName = document.getElementById("room-name");
// const userList = document.getElementById("users");

const { myid } = Qs.parse(location.search, {
    ignoreQueryPrefix: true,
});

const room = document.getElementById("roomid").value;
const username = myid;

const socket = io();

// socket.emit("joinRoom", { username, room });

// socket.on("roomFull", () => {
//     alert(`채팅방 인원은 최대 2명입니다`);
//     socket.disconnect();
//     window.history.back();
// });

// socket.on("roomUsers", ({ room, users }) => {
//     outputRoomName(room);
//     // outputUsers(users);
// });

// socket.on("message", (message) => {
//     console.log(message);
//     outputMessage(message);
//     chatMessages.scrollTop = chatMessages.scrollHeight;
// });

// function outputMessage(message) {
//     const li = document.createElement("li");
//     li.classList.add("message");
//     div.innerHTML = `
//     <p class="meta">${message.name} <span>${message.time}</span></p>
//     <p class="text">${message.text}</p>`;
//     document.querySelector("#server-result").appendChild(div);
// }

// function outputRoomName(room) {
//     roomName.innerText = room;
// }

// function outputUsers(users) {
//     userList.innerHTML = `${users
//         .map((user) => `<li id=${user.username}>${user.username}</li>`)
//         .join("")}`;
// }

// socket.on("updateUsers", (username) => {
//     const deletelist = document.getElementById(`${username}`);
//     if (deletelist) {
//         deletelist.remove();
//     }
// });

function exit(roomid, from) {
    console.log("나가기 기능");
    console.log(roomid);
    console.log(from);
    axios({
        method: "delete",
        url: "/chatroom",
        data: { roomid: roomid },
    })
        .then(() => {
            if (!from) {
                window.history.back();
            } else {
                window.location.href = `/getchatrooms?myId=${myid}`;
            }
            socket.disconnect();
            console.log("채팅방 나가기 성공");
            // 채팅방을 나간 후에 페이지 이동
        })
        .catch((error) => {
            console.error("채팅방 나가기 실패", error);
            // 실패 시 처리 로직 추가
        });
}

// 채팅 보내기
function send() {
    const msg = document.getElementById("msg");
    axios({
        method: "post",
        url: "/chatroom",
        data: {
            roomid: room,
            sendmsg: msg.value,
            sendid: username,
        },
    })
        .then((result) => {
            console.log(result.data);
        })
        .catch((error) => {
            console.log(error);
        });

    msg.value = "";
    msg.focus();

    socket.emit("chatMessage", msg);
}
