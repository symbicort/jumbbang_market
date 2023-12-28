async function register() {
    const form = document.forms["signup"];

    if (
        form.id.value.length === 0 ||
        form.pw.value.length === 0 ||
        form.address.value.length === 0
    ) {
        await swal('회원가입 실패', "필수 사항을 모두 입력해주세요", 'error');
        return;
    }

    if (form.nickname.value.length > 20) {
        await swal('회원가입 실패', "닉네임은 20자 미만이에요", 'error');
        return;
    }

    const passwordchk = form.pw.value === form.passwordCheck.value;

    if (!passwordchk) {
        await swal('회원가입 실패', "비밀번호 확인과 비밀번호 정보가 일치하지 않아요", 'error');
        return;
    }

    try {
        const response = await axios({
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
        });

        const result = response.data.existUser;
        console.log(result);

        if (!result) {
            await swal('로그인 성공', form.id.value + "님 회원가입이 완료 되었어요", 'success');
            document.location.href = "/";
        } else {
            form.id.value = "";
            form.pw.value = "";
            form.nickname.value = "";
            form.address.value = "";
            await swal('회원가입 실패', "중복된 아이디입니다 ", 'error');
        }
    } catch (error) {
        console.error("에러 발생:", error);
        // 에러 처리 로직 추가
    }
}


async function tryLogin() {
    const form = document.forms["login"];
    if (form.id.value.length === 0 || form.pw.value.length === 0) {
        await swal('로그인 실패', "회원 정보를 입력해주세요", 'error');
        return;
    }

    try {
        const response = await axios({
            method: "POST",
            url: "/login",
            data: {
                userid: form.id.value,
                userpw: form.pw.value,
            },
        });
    
        console.log("로그인 결과", response.data.result);
    
        if (response.data.result) {
            await swal('로그인 성공', form.id.value + "님 로그인이 완료되었습니다", 'success');
            document.location.href = "/";
        } else {
            await swal('로그인 실패', "다시 시도해주세요", 'error');
            form.pw.value = "";
        }
    } catch (error) {
        console.error("에러 발생:", error);
        // 에러 처리 로직 추가
    }
    
}

async function withdraw() {
    const form = document.forms["profile"];

    if (form.pw.value.length == 0) {
        await swal('회원 탈퇴 실패', "비밀번호를 입력해주세요", 'error');
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
            swal('회원탈퇴 성공', form.id.value + "님 회원탈퇴가 완료 되었습니다", 'success');
            document.location.href = "/";
        } else {
            swal('회원 정보 수정 실패', "변경할 비밀번호 정보가 일치하지 않습니다.", 'error');
        }
    });
}

function userInfoEdit() {
    const form = document.forms["profile"];

    if (form.pw.value.length == 0) {
        swal('회원 정보 수정 실패', "기존 비밀번호가 일치해야 정보 수정이 가능합니다.", 'error');
        return;
    }

    if (form.newpw.value.length != 0 && form.newpw.value.length != form.newpwchk.value.length) {
        swal('회원 정보 수정 실패', "변경할 비밀번호 정보가 일치하지 않습니다.", 'error');
        return;
    }

    if (form.image.files.length == 0) {
        axios({
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
        .then(async (res) => {
            if (res.data.result) {
                await swal('회원 정보 수정 성공', res.data.msg, 'success');
                document.location.href = "/mypage";
            } else {
                swal('회원 정보 수정 실패', res.data.msg, 'error');
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

        axios({
            method: "PATCH",
            url: "/edit_userI",
            data: formData,
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })
        .then(async (res) => {
            if (res.data.result) {
                await swal('회원 정보 수정 성공', res.data.msg, 'success');
                document.location.href = "/mypage";
            } else {
                swal('회원 정보 수정 실패', res.data.msg, 'error');
                form.pw.value = "";
            }
        })
        .catch((err) => {
            console.error("회원 정보 수정 정보 에러", err);
        });
    }
}
