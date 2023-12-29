const chatForm = document.getElementById("server-result");
const getMessages = document.querySelector("#msg").value;
const setroomName = document.getElementById("room_name");
const userList = document.getElementById("userList");
const getroomname = document.getElementById("roomname").value;
let myprofileimage = document.getElementById("myprofileimage").value;
let yourprofileimage = document.getElementById("yourprofileimage").value;
if (!myprofileimage) {
    myprofileimage =
        "https://d1unjqcospf8gs.cloudfront.net/assets/users/default_profile_80-c649f052a34ebc4eee35048815d8e4f73061bf74552558bb70e07133f25524f9.png";
}
if (!yourprofileimage) {
    yourprofileimage =
        "https://d1unjqcospf8gs.cloudfront.net/assets/users/default_profile_80-c649f052a34ebc4eee35048815d8e4f73061bf74552558bb70e07133f25524f9.png";
}

// 입장 공지
const usernick = document.getElementById("usernick").value;
const chatBox = document.getElementById("server-result");
const li = document.createElement("li");
const span = document.createElement("span");
span.textContent = usernick + "님이 입장하셨습니다";
li.classList.add("notice");
li.append(span);
// chatBox의 첫 번째 자식 요소로 li를 삽입
const firstChild = chatBox.firstChild;
chatBox.insertBefore(li, firstChild);

// socket 기능
const room = document.getElementById("roomid").value;
const userid = document.getElementById("userid").value;
// 이전 채팅 날짜
let prevDate = null;
const socket = io("ws://54.180.96.49", {
    transports: ["websocket"],
});
socket.on("connect", () => {
    console.log("Socket connected:", socket.id);
});

socket.emit("joinRoom", { userid, room });

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

moment.locale("ko");
function outputMessage(data) {
    const li = document.createElement("li");
    const newDate = moment().format("YYYY-MM-DD");
    if (newDate != prevDate) {
        // 새로운 날짜를 이전 날짜로 업데이트
        prevDate = newDate;
        li.classList.add("notice");
        li.innerHTML = `<span>${moment().format("YYYY-MM-DD")}</span>`;
        document.querySelector("#server-result").appendChild(li);
        li.innerHTML = "";
        li.classList.remove("notice");
    }
    if (data.id === socket.id) {
        li.classList.add("me");
        li.innerHTML = `
        <span class="thumb"
        style="background-image: url('${myprofileimage}')">
    </span>
        <span>${data.text}</span>
        <p class="date">${moment().format("a h:mm")}</p>`;
    } else {
        li.classList.add("other");
        li.innerHTML = `
        <span class="thumb"
        style="background-image: url('${yourprofileimage}')">
    </span>
        <span>${data.text}</span>
        <p class="date">${moment().format("a h:mm")}</p>`;
    }
    document.querySelector("#server-result").appendChild(li);
}

function outputRoomName(roomname) {
    setroomName.innerText = roomname;
}

function exit(roomid, from) {
    console.log("나가기 기능");
    // console.log(roomid);
    // console.log(from);
    axios({
        method: "delete",
        url: "/chatroom",
        data: { roomid: roomid },
    })
        .then(() => {
            if (!from) {
                // market 접근
                window.history.back();
            } else {
                // chatrooms 접근
                window.location.href = `/getchatrooms?userid=${userid}`;
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

// 상대방 회원정보 존재 여부 확인
const hasYourInfo = document.getElementById("hasyourinfo").value;
const msgInput = document.getElementById("msg");
// const sendButton = document.querySelector("button");

console.log(hasYourInfo);
if (hasYourInfo === "false") {
    msgInput.disabled = true;
    msgInput.placeholder = "탈퇴한 회원입니다";
    msgInput.classList.add("sendbtn_red");
}

// 채팅 보내기
function send() {
    // 상대방 회원정보 존재 여부 확인
    const hasYourInfo = document.getElementById("hasyourinfo").value;
    const msgInput = document.getElementById("msg");
    // const sendButton = document.querySelector("button");

    console.log(hasYourInfo);
    if (hasYourInfo === "false") {
        msgInput.disabled = true;
        swal("메시지 전송 실패", "탈퇴한 회원입니다", "error");
        return;
    }

    const msg = document.getElementById("msg");
    axios({
        method: "post",
        url: "/chatroom",
        data: {
            roomid: room,
            sendmsg: msg.value,
            sendid: userid,
        },
    })
        .then((result) => {
            console.log(result.data);
        })
        .catch((error) => {
            console.log(error);
        });
    const data = {
        userid: userid,
        id: socket.id,
        msg: msg.value,
    };
    console.log("msg check", msg.value);
    console.log("chatdata", data);
    socket.emit("chatMessage", data);
    msg.value = "";
    msg.focus();
}
