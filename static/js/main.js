var swiper = new Swiper(".mySwiper", {
    cssMode: true,
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
    },
    pagination: {
        el: ".swiper-pagination",
    },
    mousewheel: true,
    keyboard: true,
});

const searchInput = document.getElementById("searchInput");
function searchIndex() {
    if (searchInput.value) {
        // console.log(searchInput.value);
        const searchWord = searchInput.value;
        searchInput.value = "";
        window.location.href = `/search?searchWord=${searchWord}`;
    }
}
