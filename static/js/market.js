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
/* let btnGroup = document.querySelector(".airBtns");
const el = document.querySelector("main");
const observer = new IntersectionObserver(
    ([e]) => btnGroup.classList.toggle("show", e.intersectionRatio < 1),
    {
        threshold: [1],
    }
);
observer.observe(el);
 */
//중거거래 정렬
const btnSortBtns = document.querySelectorAll("[name=sort]");
const cardBox = document.getElementById("cards_wrap");
btnSortBtns.forEach((elm, i) => {
    elm.addEventListener("click", function (e) {
        let val = e.target.value;
        // console.log("val", val);
        axios({
            method: "get",
            url: "/marketsort",
            params: {
                selectedSort: val,
            },
        })
            .then((result) => {
                // console.log(cardBox);
                cardBox.innerHTML = "";
                // console.log(result.data);
                const sortedArray = result.data.postData;
                let html = "";
                for (let i = 0; i < sortedArray.length; i++) {
                    html += ` <article class="card">
                    <a class="card-link" href="/articles/${sortedArray[i]._id}">
                        <div class="card-photo"
                            style="background-image: url('${sortedArray[i].images[0]}')">
                            <img alt="오락기" src="${sortedArray[i].images[0]}" crossorigin="anonymous">
                        </div>
                        <div class="card-desc">
                            <h2 class="card-title">
                            ${sortedArray[i].subject}
                            </h2>
                            <div class="card-price">
                            ${sortedArray[i].priceLast}
                            </div>
                            <div class="card-region-name">
                            ${sortedArray[i].userid.address}
                            </div>
                            <div class="card-counts">
                                <span class="bookmarkHit" aria-label="관심">
                                ${sortedArray[i].bookmark_hit}
                                </span> ∙
                                <span class="chatHit" aria-label="채팅">
                                ${sortedArray[i].chat}
                                </span> ∙
                                <span class="hit" aria-label="조회">
                                ${sortedArray[i].hit}
                                </span>

                            </div>
                        </div>
                    </a>
                </article>`;
                }
                // console.log("Generated HTML:", html);
                cardBox.innerHTML = html;
            })
            .catch((error) => {
                console.log("sort error", error);
            });
    });
});
const priceSortInput = document.querySelectorAll("[name=filterPrice]");
priceSortInput.forEach((elm, i) => {
    elm.addEventListener("click", function (e) {
        let val = e.target.value;
        // console.log("val", val);
        axios({
            method: "get",
            url: "/marketsort",
            params: {
                selectedSort: val,
            },
        })
            .then((result) => {
                // console.log(cardBox);
                cardBox.innerHTML = "";
                // console.log(result.data);
                const sortedArray = result.data.postData;
                let html = "";
                for (let i = 0; i < sortedArray.length; i++) {
                    html += ` <article class="card">
                    <a class="card-link" href="/articles/${sortedArray[i]._id}">
                        <div class="card-photo"
                            style="background-image: url('${sortedArray[i].images[0]}')">
                            <img alt="오락기" src="${sortedArray[i].images[0]}" crossorigin="anonymous">
                        </div>
                        <div class="card-desc">
                            <h2 class="card-title">
                            ${sortedArray[i].subject}
                            </h2>
                            <div class="card-price">
                            ${sortedArray[i].priceLast}
                            </div>
                            <div class="card-region-name">
                            ${sortedArray[i].userid.address}
                            </div>
                            <div class="card-counts">
                                <span class="bookmarkHit" aria-label="관심">
                                ${sortedArray[i].bookmark_hit}
                                </span> ∙
                                <span class="chatHit" aria-label="채팅">
                                ${sortedArray[i].chat}
                                </span> ∙
                                <span class="hit" aria-label="조회">
                                ${sortedArray[i].hit}
                                </span>

                            </div>
                        </div>
                    </a>
                </article>`;
                }
                // console.log("Generated HTML:", html);
                cardBox.innerHTML = html;
            })
            .catch((error) => {
                console.log("sort error", error);
            });
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

async function addpost() {
    const form = document.forms["marketWrite"];

    if (
        form.subject.value == "" ||
        form.comment.value == "" ||
        form.priceFirst.value == "" ||
        form.priceDirect.value == "" ||
        form.dateLimit.value == ""
    ) {
        await swal('로그인 성공', "정보를 모두 입력해주세요", 'success')
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
            swal('게시물 작성 완료', "게시물 작성이 완료 되었습니다.", 'success');
            document.location.href = "/market";
        }
    });
}

async function enterbid() {
    const currentURL = window.location.href;
    console.log(currentURL);

    // URL에서 마지막 부분 추출
    const urlWithoutQuery = currentURL.split("?")[0];
    const lastSegment = urlWithoutQuery.split("/").pop();
    console.log(lastSegment);

    const form = document.forms["formBid"];
    await axios({
        method: "POST",
        url: "/market/bid",
        data: {
            bidprice: form.price.value,
            productId: lastSegment,
        },
    }).then((res) => {
        swal('경매 참여 완료', bidprice + "원에 입찰하셨습니다.", 'success');
        location.reload();
    });
}

function buyDirect() {
    const currentURL = window.location.href;
    console.log(currentURL);

    // URL에서 마지막 부분 추출
    const urlWithoutQuery = currentURL.split("?")[0];
    const lastSegment = urlWithoutQuery.split("/").pop();
    console.log(lastSegment);

    const form = document.forms["formBid"];
    axios({
        method: "POST",
        url: "/market/directBuy",
        data: {
            productId: lastSegment,
        },
    }).then((res) => {
        console.log(res.data.msg);
        swal('물품 구매 완료', bidprice + "원에 즉시 구매 하셨습니다.", 'success');
        location.reload();
    });
}

function usercheck() {
    const currentURL = window.location.href;

    const urlWithoutQuery = currentURL.split("?")[0];
    const lastSegment = urlWithoutQuery.split("/").pop();
    console.log(lastSegment);

    axios({
        method: "POST",
        url: "/market/userchk",
        data: {
            productId: lastSegment,
        },
    }).then((res) => {
        console.log(res.data.islogin);
        if (res.data.islogin == true) {
            if (res.data.result == false) {
                location.reload();
                swal('수정 실패', "본인이 작성한 게시물이 아닙니다", 'error');
            }
        } else {
            swal('로그인 인증 실패', "로그인 상태가 아닙니다.", 'error');
            document.location.href = "/login";
        }
    });
}

async function editarticle() {
    const currentURL = window.location.href;

    const urlWithoutQuery = currentURL.split("?")[0];
    const lastSegment = urlWithoutQuery.split("/").pop();

    const subject = document.getElementById("subject");
    const content = document.getElementById("comment");
    const state = document.getElementById("state");

    await axios({
        method: "PATCH",
        url: "/market/editArticle",
        data: {
            articleid: lastSegment,
            subject: subject.value,
            content: content.value,
            state: state.value,
        },
    }).then((res) => {
        swal('게시물 수정 완료',res.data.msg , 'success');
    });
}
