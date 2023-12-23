// 상단 메뉴
const menu = document.querySelector('#nav .fa-bars');
const categoryMenu = document.querySelector('#nav .menu-category');
menu.addEventListener('click', function (e) {
  categoryMenu.classList.toggle('d-none');
  console.log(e);
});

// 알림아이콘 호버
document.addEventListener('DOMContentLoaded', function () {
  const notifyIcon = document.querySelector('.fa-bell');
  const notify = document.querySelector('.notify');
  let notifyTimeout;

  notifyIcon.addEventListener('mouseenter', function () {
    clearTimeout(notifyTimeout);
    notify.style.display = 'block';
  });

  notifyIcon.addEventListener('mouseleave', function () {
    notifyTimeout = setTimeout(function () {
      notify.style.display = 'none';
    }, 200);
  });

  notify.addEventListener('mouseenter', function () {
    clearTimeout(notifyTimeout);
  });

  notify.addEventListener('mouseleave', function () {
    notifyTimeout = setTimeout(function () {
      notify.style.display = 'none';
    }, 200);
  });

  // 사용자 아이콘 호버
  const userIcon = document.querySelector('.fa-user');
  const userList = document.querySelector('.user-list');
  let userTimeout;

  userIcon.addEventListener('mouseenter', function () {
    clearTimeout(userTimeout);
    userList.style.display = 'block';
  });

  userIcon.addEventListener('mouseleave', function () {
    userTimeout = setTimeout(function () {
      userList.style.display = 'none';
    }, 200);
  });

  userList.addEventListener('mouseenter', function () {
    clearTimeout(userTimeout);
  });

  userList.addEventListener('mouseleave', function () {
    userTimeout = setTimeout(function () {
      userList.style.display = 'none';
    }, 200);
  });
});

// 채팅방 페이지로 이동
function goChatrooms() {
  const myname = 'myname';
  window.location.href = `/getchatrooms?myName=${myname}`;
}
