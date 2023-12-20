// 상단 메뉴
const menu = document.querySelector('#nav .hambugerbtn');
const categoryMenu = document.querySelector('#nav .menu-category');
menu.addEventListener('click', function (e) {
  categoryMenu.classList.toggle('d-none');
  console.log(e);
});
