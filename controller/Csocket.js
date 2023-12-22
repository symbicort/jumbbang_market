const express = require("express");
const router = express.Router();
const Announcement = "공지";

module.exports = function (server) {
    const socketIO = require("socket.io");
    const io = socketIO(server);

    router.get("/chatroom", (req, res) => {
        // 특정 페이지 뷰를 렌더링
        res.render("chats");
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
                formatMessage(Announcement, "북적북적에 오신것을 환영합니다!!")
            );
            socket.broadcast
                .to(user.room)
                .emit(
                    "message",
                    formatMessage(
                        Announcement,
                        `${user.username}님이 입장하셨습니다.`
                    )
                );

            io.to(user.room).emit("roomUsers", {
                room: user.room,
                users: getRoomUsers(user.room),
            });
        });

        socket.on("chatMessage", (msg) => {
            const user = getCurrentUser(socket.id);
            io.to(user.room).emit("message", formatMessage(user.username, msg));
        });

        socket.on("disconnect", () => {
            const user = userLeave(socket.id);
            if (user) {
                io.to(user.room).emit(
                    "message",
                    formatMessage(
                        Announcement,
                        `${user.username}님이 퇴장하셨습니다.`
                    )
                );
                io.to(user.room).emit("updateUsers", user.username);
                console.log("삭제할 username >", user.username);
            }
        });
    });
    return router;
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
function formatMessage(name, text) {
    return {
        name,
        text,
        date: moment().format("YYYY-MM-DD"),
        time: moment().format("h:mm a"),
    };
}
