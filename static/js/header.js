// 상단 메뉴
const menu = document.querySelector("#nav .hambugerbtn");
const categoryMenu = document.querySelector("#nav .menu-category");
menu.addEventListener("click", function (e) {
    categoryMenu.classList.toggle("d-none");
    console.log(e);
});

// 채팅방 페이지로 이동
function goChatrooms() {
    const myname = "myname";
    window.location.href = `/getchatrooms?myName=${myname}`;
}
