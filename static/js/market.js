// const slideImgs = ["/static/imgs/test.jpg", "/static/imgs/test.png"];
// async function bgc(slideImgs) {
//     const colorThief = new ColorThief();
//     await slideImgs.forEach((img, i) => {
//         const html = `
//         <div class="swiper-slide image" style="background-image: url(${img});"><img src='${img}' id='newimage${i}' crossorigin="Anonymous"></div>
// 		`;
//         const slider = document.querySelector(".swiper-wrapper");
//         slider.insertAdjacentHTML("beforeend", html);
//         let sliderImg = document.querySelector("#newimage" + i);
//         if (!sliderImg.complete) {
//             sliderImg.addEventListener("load", function (e) {
//                 let color = colorThief.getColor(sliderImg);
//                 e.target.parentNode.style.borderColor = `rgba(${color[0]},${color[1]},${color[2]},.5)`;
//                 if (color[0] > 50) {
//                     e.target.parentNode.style.backgroundColor = `rgba(${color[0]},${color[1]},${color[2]},.5)`;
//                 }
//             });
//         }
//     });
// }

// if (document.querySelector(".swiper-container")) {
//     const swiper1 = new Swiper(".swiper-container", {
//         pagination: {
//             el: ".swiper-pagination",
//         },
//         navigation: {
//             nextEl: ".swiper-container .swiper-button-next",
//             prevEl: ".swiper-container .swiper-button-prev",
//         },
//     });
//     bgc(slideImgs);
// }

// 팝오버
const popoverTriggerList = document.querySelectorAll(
    '[data-bs-toggle="popover"]'
);
const popoverList = [...popoverTriggerList].map(
    (popoverTriggerEl) => new bootstrap.Popover(popoverTriggerEl)
);

//중고거래 하단 글쓰기 버튼
let btnGroup = document.querySelector(".airBtns");
const el = document.querySelector("main");
const observer = new IntersectionObserver(
    ([e]) => btnGroup.classList.toggle("show", e.intersectionRatio < 1),
    {
        threshold: [1],
    }
);
observer.observe(el);

//중거거래 정렬 : 체크용 (임시)
const btnSortBtns = document.querySelectorAll("[name=sort]");
btnSortBtns.forEach((elm, i) => {
    elm.addEventListener("click", function (e) {
        let val = e.target.value;
        localStorage.setItem("marketSort", val);
    });
});

//테스트
const productData = {
    priceFirst: 190000,
    priceLast: 195000,
    priceDirect: 300000,
};
function btnBid() {}

// 중고거래 상세페이지 채팅버튼 함수
function directChat() {
    const productId = document.getElementById("productid").value;
    const postName = document.querySelector("#nick").innerText;

    axios({
        method: "get",
        url: "/getcurrentuserid",
    })
        .then((result) => {
            const username = result.data.username;
            console.log(username);
            // 채팅 페이지로 이동
            window.location.href = `/chatroom?postName=${postName}&myName=${username}&productId=${productId}`;
        })
        .catch((err) => {
            console.log("현재아이디찾기 실패", err);
        });
}

async function addpost() {
    const form = document.forms["marketWrite"];

    if (
        form.subject.value == "" ||
        form.comment.value == "" ||
        form.priceFirst.value == "" ||
        form.priceDirect.value == "" ||
        form.dateLimit.value == ""
    ) {
        alert("정보를 모두 입력해주세요.");
        return;
    }

    const image = document.getElementById("image");

    let formData = new FormData();

    formData.append("subject", form.subject.value);
    formData.append("comment", form.comment.value);
    formData.append("category", form.category.value);
    formData.append("state", form.state.value);
    formData.append("priceFirst", form.priceFirst.value);
    formData.append("priceDirect", form.priceDirect.value);
    formData.append("dateLimit", form.dateLimit.value);

    for (let i = 0; i < image.files.length; i++) {
        formData.append("files", image.files[i]);
    }

    await axios({
        method: "POST",
        url: "/market/write",
        data: formData,
        headers: {
            "Content-Type": "multipart/form-data",
        },
    }).then((res) => {
        console.log(res);
        if (res) {
            alert("게시물 작성이 완료되었습니다.");
            document.location.href = "/market";
        }
    });
}

function enterbid(){
    const currentURL = window.location.href;
    console.log(currentURL);

    // URL에서 마지막 부분 추출
    const lastSegment = currentURL.split('/').pop();

    console.log(lastSegment);

    const form = document.forms['formBid'];
    axios({
        method: "POST",
        url: "/market/bid",
        data: {
            bidprice: form.price.value,
            productId: lastSegment
        }
    }).then((res) => {
        console.log(res.data.msg);
        alert(res.data.msg);
        location.reload();
    })
}

