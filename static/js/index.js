async function register(){
    const form = document.forms['signup'];

    if (form.id.value.length === 0 || form.nickname.value.length === 0 || form.pw.value.length === 0 || form.address.value.length === 0) {
        alert('정보를 모두 기입해주세요');
        return;
    }

    if (form.nickname.value.length > 20) {
        alert('이름은 20글자 미만입니다!');
        return;
    }

    if(form.pw.value !== form.passwordCheck.value){
        alert('비밀번호가 일치하지 않습니다. 다시 입력해주세요');
        return;
    }

    await axios({
        method: 'POST',
        url: '/register',
        data: {
            userid: form.id.value,
            userpw: form.pw.value,
            nickname: form.nickname.value,
            email: form.email.value,
            contact: form.contact.value,
            address: form.address.value
        }
    }).then((res) => {
        const result = res.data.existUser;
        console.log(result);
        if(!result) {
            alert('회원가입 성공');
            document.location.href = '/';
        } else {
            form.id.value = '';
            form.pw.value = '';
            form.nickname.value = '';
            form.address.value = '';
            alert('중복된 아이디입니다 다시 입력해주세요');
        }
    })
}

async function tryLogin(){
    const form = document.forms['login'];
    if (form.id.value.length === 0 || form.pw.value.length === 0) {
        alert('정보를 모두 기입해주세요');
        return;
    }

    await axios({
        method: 'POST',
        url: '/login',
        data: {
            userid: form.id.value,
            userpw: form.pw.value
        }
    }).then((res) => {
        console.log('로그인 결과',res.data.result)
        if(res.data.result){
            alert('로그인 성공');
            document.location.href = '/'
        } else{
            alert('로그인 실패, 다시 시도해주세요');
            form.pw.value = ''
        }
    })
}