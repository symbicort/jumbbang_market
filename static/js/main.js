var swiper = new Swiper('.mySwiper', {
  effect: 'fade',
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  autoplay: {
    delay: 2500,
    disableOnInteraction: false,
  },
  loop: false,
  pagination: {
    el: '.swiper-pagination',
  },
  mousewheel: true,
  keyboard: true,
});

const searchInput = document.getElementById('searchInput');
function searchIndex() {
  if (searchInput.value) {
    // console.log(searchInput.value);
    const searchWord = searchInput.value;
    searchInput.value = '';
    window.location.href = `/search?searchWord=${searchWord}`;
  }
}
