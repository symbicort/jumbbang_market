const { myName } = Qs.parse(location.search, {
    ignoreQueryPrefix: true,
});
const roomid = document.getElementById("productid").value;
function exit() {
    console.log("채팅방 나가기");
    axios({
        method: "delete",
        url: "/chatroom",
        data: { roomid: roomid },
    });
    window.location.href = `getchatrooms?myName=${myName}`;
}
