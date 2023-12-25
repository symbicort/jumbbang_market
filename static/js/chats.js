const chatForm = document.getElementById("server-result");
const getMessages = document.querySelector("#msg").value;
const setroomName = document.getElementById("room_name");
const userList = document.getElementById("userList");
const getroomname = document.getElementById("roomname").value;

const { myName } = Qs.parse(location.search, {
    ignoreQueryPrefix: true,
});

// 입장 공지
const chatBox = document.getElementById("server-result");
const li = document.createElement("li");
const span = document.createElement("span");
span.textContent =
    document.getElementById("nick1").innerText + "님이 입장하셨습니다";
li.classList.add("notice");
li.append(span);

// chatBox의 첫 번째 자식 요소로 li를 삽입
const firstChild = chatBox.firstChild;
chatBox.insertBefore(li, firstChild);

// socket 기능
const room = document.getElementById("roomid").value;
const username = myName;
// console.log(username);
const io = require("socket.io-client");
const socket = io("http://localhost:8000");
socket.on("connect", () => {
    console.log("Socket connected:", socket.id);
});

socket.emit("joinRoom", { username, room });

socket.on("roomFull", () => {
    alert(`채팅방 인원은 최대 2명입니다`);
    socket.disconnect();
    window.history.back();
});

socket.on("roomUsers", () => {
    outputRoomName(getroomname);
});

socket.on("message", (data) => {
    console.log(data);
    outputMessage(data);
    chatForm.scrollTop = chatForm.scrollHeight;
});

function outputMessage(data) {
    const li = document.createElement("li");
    if (data.id === socket.id) {
        li.classList.add("me");
        li.innerHTML = `
        <span>${data.text}</span>
        <p class="date">${data.time}</p>`;
    } else if ((data.name = "notice")) {
        li.classList.add("notice");
        li.innerHTML = `<span>${data.text}</span>`;
    } else {
        li.classList.add("other");
        li.innerHTML = `
        <span>${data.text}</span>
        <p class="date">${data.time}</p>`;
    }
    document.querySelector("#server-result").appendChild(li);
}

function outputRoomName(roomname) {
    setroomName.innerText = roomname;
}

// function outputUsers(users) {
//     userList.innerHTML = `${users
//         .map((user) => `<li id=${user.username}>${user.username}</li>`)
//         .join("")}`;
// }

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
                window.location.href = `/getchatrooms?myName=${myName}`;
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

    const data = {
        username: username,
        id: socket.id,
        msg: msg.value,
    };
    socket.emit("chatMessage", data);
}
