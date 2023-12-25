const socketIO = require("socket.io");

module.exports = function (server) {
    const io = socketIO(server, {
        cors: {
            origin: "http://localhost:8000", // 클라이언트의 주소에 맞게 변경
            methods: ["GET", "POST"],
        },
    });
    // socket 연결
    io.on("connection", (socket) => {
        console.log("Socket connection status:", socket.connected);

        console.log("socket 연결 > ", socket.id);
        socket.on("joinRoom", ({ username, room }) => {
            // Check if the room is full
            let roomUsers = getRoomUsers(room);
            console.log("현재 room 인원", roomUsers);
            if (roomUsers.length >= 2) {
                // Emit an event to the client to handle redirection
                socket.emit("roomFull");
                socket.disconnect();
                console.log("Socket connection status:", socket.connected);
                return;
            }
            const user = userJoin(socket.id, username, room);
            socket.join(user.room);
            roomUsers = getRoomUsers(user.room);
            console.log("join후 room 인원", roomUsers);

            socket.emit(
                "message",
                formatMessage(
                    socket,
                    `${user.username}님 환영합니다!`,
                    "notice"
                )
            );
            socket.broadcast
                .to(user.room)
                .emit(
                    "message",
                    formatMessage(
                        socket,
                        `${user.username}님이 입장하셨습니다.`,
                        "notice"
                    )
                );

            io.to(user.room).emit("roomUsers");
        });

        socket.on("chatMessage", (data) => {
            const user = getCurrentUser(socket.id);
            io.to(user.room).emit(
                "message",
                formatMessage(socket, data.msg, data.username)
            );
        });

        socket.on("disconnect", () => {
            const user = userLeave(socket.id);
            if (user) {
                io.to(user.room).emit(
                    "message",
                    formatMessage(
                        socket,
                        `${user.username}님이 퇴장하셨습니다.`,
                        "notice"
                    )
                );
                console.log("삭제할 username >", user.username);
            }
        });
    });
    return io;
};

// ----------------------------------
// 채팅 관련 함수
const users = [];

// 사용자 배열에 user 추가
function userJoin(id, username, room) {
    const user = { id, username, room };
    users.push(user);
    return user;
}

// 사용자 배열에서 id가 현재 socket.id인 본인 구하기
function getCurrentUser(id) {
    return users.find((user) => user.id === id);
}

// id로 나갈 사람의 index를 찾고 사용자 배열에서 빼기
function userLeave(id) {
    const index = users.findIndex((user) => user.id === id);
    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
}

//사용자 중 현재 room에 포함된 유저 반환
function getRoomUsers(room) {
    return users.filter((user) => user.room === room);
}

// 이름, 메시지에 입력 시간 추가
const moment = require("moment");
function formatMessage(socket, text, name) {
    return {
        id: socket.id,
        name,
        text,
        date: moment().format("YYYY-MM-DD"),
        time: moment().format("a h:mm"),
    };
}
