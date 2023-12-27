// 상단 메뉴
// const menu = document.querySelector('#nav .fa-bars');
// const categoryMenu = document.querySelector('#nav .menu-category');
// menu.addEventListener('click', function (e) {
//   categoryMenu.classList.toggle('d-none');
//   console.log(e);
// });

// 알림아이콘 호버
document.addEventListener("DOMContentLoaded", function () {
    const notifyIcon = document.querySelector(".fa-bell");
    const notify = document.querySelector(".notify");
    let notifyTimeout;

    notifyIcon.addEventListener("mouseenter", function () {
        clearTimeout(notifyTimeout);
        notify.style.display = "block";
    });

    notifyIcon.addEventListener("mouseleave", function () {
        notifyTimeout = setTimeout(function () {
            notify.style.display = "none";
        }, 200);
    });

    notify.addEventListener("mouseenter", function () {
        clearTimeout(notifyTimeout);
    });

    notify.addEventListener("mouseleave", function () {
        notifyTimeout = setTimeout(function () {
            notify.style.display = "none";
        }, 200);
    });

    // 사용자 아이콘 호버
    const userIcon = document.querySelector(".fa-user");
    const userList = document.querySelector(".user-list");
    let userTimeout;

    userIcon.addEventListener("mouseenter", function () {
        clearTimeout(userTimeout);
        userList.style.display = "block";
    });

    userIcon.addEventListener("mouseleave", function () {
        userTimeout = setTimeout(function () {
            userList.style.display = "none";
        }, 200);
    });

    userList.addEventListener("mouseenter", function () {
        clearTimeout(userTimeout);
    });

    userList.addEventListener("mouseleave", function () {
        userTimeout = setTimeout(function () {
            userList.style.display = "none";
        }, 200);
    });
});

// 채팅방 페이지로 이동
function goChatrooms() {
    axios({
        method: "get",
        url: "/getcurrentuserid",
    })
        .then((result) => {
            const username = result.data.username;
            console.log(username);
            // 채팅방 페이지로 이동
            window.location.href = `/getchatrooms?myName=${username}`;
        })
        .catch((err) => {
            console.log("현재아이디찾기 실패", err);
        });
}

document.addEventListener("DOMContentLoaded", () => {
    // 이벤트 핸들러 등록 전에 해당 요소가 존재하는지 확인
    const logoutLink = document.getElementById("logoutLink");
    if (logoutLink) {
        document.addEventListener("click", async (event) => {
            const target = event.target;
            if (target.id === "logoutLink") {
                event.preventDefault();
                const response = await axios.post("/logout");
                console.log("로그아웃 결과", response.data);
                window.location.reload(); // 예: 페이지 새로고침
            }
        });
    }
});

// 헤더 작은 검색창
const headerSearch = document.querySelector(".fa-magnifying-glass");
const headerSearchInput = document.getElementById("header-search");

headerSearch.addEventListener("click", function () {
    console.log(headerSearchInput);
    headerSearchInput.classList.toggle("active");
    headerSearchInput.focus();
});

const searchInput = document.getElementById("header-search");
function search() {
    if (searchInput.value) {
        // console.log(searchInput.value);
        const searchWord = searchInput.value;
        window.location.href = `/search?searchWord=${searchWord}`;
    }
}
