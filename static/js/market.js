const slideImgs = ['/static/imgs/test.jpg', '/static/imgs/test.png'];
async function bgc(slideImgs) {
	const colorThief = new ColorThief();
	await slideImgs.forEach((img, i) => {
		const html = `
      <div class="swiper-slide image" style="background-image: url(${img});"><img src='${img}' id='newimage${i}' crossorigin="Anonymous"></div>
		`;
		const slider = document.querySelector('.swiper-wrapper');
		slider.insertAdjacentHTML('beforeend', html);
		let sliderImg = document.querySelector('#newimage' + i);
		if (!sliderImg.complete) {
			sliderImg.addEventListener('load', function (e) {
				let color = colorThief.getColor(sliderImg);
				e.target.parentNode.style.borderColor = `rgba(${color[0]},${color[1]},${color[2]},.5)`;
				if (color[0] > 50) {
					e.target.parentNode.style.backgroundColor = `rgba(${color[0]},${color[1]},${color[2]},.5)`;
				}
			});
		}
	});
}

if (document.querySelector('.swiper-container')) {
	const swiper1 = new Swiper('.swiper-container', {
		pagination: {
			el: '.swiper-pagination',
		},
		navigation: {
			nextEl: '.swiper-container .swiper-button-next',
			prevEl: '.swiper-container .swiper-button-prev',
		},
	});
	bgc(slideImgs);
}

// 팝오버
const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]');
const popoverList = [...popoverTriggerList].map((popoverTriggerEl) => new bootstrap.Popover(popoverTriggerEl));

//중고거래 하단 글쓰기 버튼
let btnGroup = document.querySelector('.airBtns');
const el = document.querySelector('main');
const observer = new IntersectionObserver(([e]) => btnGroup.classList.toggle('show', e.intersectionRatio < 1), {
	threshold: [1],
});
observer.observe(el);

//중거거래 정렬 : 체크용 (임시)
const btnSortBtns = document.querySelectorAll('[name=sort]');
btnSortBtns.forEach((elm, i) => {
	elm.addEventListener('click', function (e) {
		let val = e.target.value;
		localStorage.setItem('marketSort', val);
	});
});

//테스트
const productData = {
	priceFirst: 190000,
	priceLast: 195000,
	priceDirect: 300000,
};
function btnBid() {}
