const { myName } = Qs.parse(location.search, {
    ignoreQueryPrefix: true,
});

function exit(nowroomid) {
    console.log("채팅방 나가기");
    axios({
        method: "delete",
        url: "/chatroom",
        data: { roomid: nowroomid },
    })
        .then(() => {
            console.log("채팅방 나가기 성공");
            // 페이지 이동을 axios 요청 완료 이후에 수행
            window.location.href = `/getchatrooms?myName=${myName}`;
        })
        .catch((error) => {
            console.error("채팅방 나가기 실패", error);
            // 실패 시 처리 로직 추가
        });
}
