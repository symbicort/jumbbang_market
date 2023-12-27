async function register() {
    const form = document.forms["signup"];

    if (
        form.id.value.length === 0 ||
        form.nickname.value.length === 0 ||
        form.pw.value.length === 0 ||
        form.address.value.length === 0
    ) {
        alert("정보를 모두 기입해주세요");
        return;
    }

    if (form.nickname.value.length > 20) {
        alert("이름은 20글자 미만입니다!");
        return;
    }

    if (form.pw.value !== form.passwordCheck.value) {
        alert("비밀번호가 일치하지 않습니다. 다시 입력해주세요");
        return;
    }

    await axios({
        method: "POST",
        url: "/register",
        data: {
            userid: form.id.value,
            userpw: form.pw.value,
            nickname: form.nickname.value,
            email: form.email.value,
            contact: form.contact.value,
            address: form.address.value,
        },
    }).then((res) => {
        const result = res.data.existUser;
        console.log(result);
        if (!result) {
            alert("회원가입 성공");
            document.location.href = "/";
        } else {
            form.id.value = "";
            form.pw.value = "";
            form.nickname.value = "";
            form.address.value = "";
            alert("중복된 아이디입니다 다시 입력해주세요");
        }
    });
}

async function tryLogin() {
    const form = document.forms["login"];
    if (form.id.value.length === 0 || form.pw.value.length === 0) {
        alert("정보를 모두 기입해주세요");
        return;
    }

    await axios({
        method: "POST",
        url: "/login",
        data: {
            userid: form.id.value,
            userpw: form.pw.value,
        },
    }).then((res) => {
        console.log("로그인 결과", res.data.result);
        if (res.data.result) {
            alert("로그인 성공");
            document.location.href = "/";
        } else {
            alert("로그인 실패, 다시 시도해주세요");
            form.pw.value = "";
        }
    });
}

async function withdraw() {
    const form = document.forms["profile"];

    if (form.pw.value.length == 0) {
        alert("회원 탈퇴의 경우 기존 비밀번호 입력 필수입니다.");
        return;
    }

    await axios({
        method: "POST",
        url: "/withdraw",
        data: {
            userid: form.id.value,
            userpw: form.pw.value,
        },
    }).then((res) => {
        if (res.data.result) {
            alert("회원탈퇴가 완료 되었습니다.");
            document.location.href = "/";
        } else {
            alert(res.data.msg);
        }
    });
}

async function userInfoEdit() {
    const form = document.forms["profile"];

    if (form.pw.value.length == 0) {
        alert("기존 비밀번호가 일치해야 정보 수정이 가능합니다.");
        return;
    }

    if (form.newpw.value.length != 0) {
        if (form.newpw.value.length != form.newpwchk.value.length) {
            alert("변경할 비밀번호 정보가 일치하지 않습니다.");
            return;
        }
    }

    if (form.image.files.length == 0) {
        await axios({
            method: "PATCH",
            url: "/edit_user",
            data: {
                userid: form.id.value,
                userpw: form.pw.value,
                newpw: form.newpw.value,
                usernick: form.nick.value,
                email: form.email.value,
                contact: form.contact.value,
                addr: form.address.value,
            },
        })
            .then((res) => {
                if (res.data.result) {
                    alert(res.data.msg);
                    document.location.href = "/mypage";
                } else {
                    alert(res.data.msg);
                    form.pw.value = "";
                }
            })
            .catch((err) => {
                console.error("회원 정보 수정 정보 에러", err);
            });
    } else {
        const profileImg = form.image;

        let formData = new FormData();

        formData.append("userid", form.id.value);
        formData.append("userpw", form.pw.value);
        formData.append("newpw", form.newpw.value);
        formData.append("usernick", form.nick.value);
        formData.append("email", form.email.value);
        formData.append("contact", form.contact.value);
        formData.append("addr", form.address.value);
        formData.append("image", profileImg.files[0]);

        await axios({
            method: "PATCH",
            url: "/edit_userI",
            data: formData,
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })
            .then((res) => {
                if (res.data.result) {
                    alert(res.data.msg);
                    document.location.href = "/mypage";
                } else {
                    alert(res.data.msg);
                    form.pw.value = "";
                }
            })
            .catch((err) => {
                console.error("회원 정보 수정 정보 에러", err);
            });
    }
}
