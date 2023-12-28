const bcrypt = require('bcrypt');

// 1. 비밀번호 해싱 함수
function hashPW(password) {
    const salt = bcrypt.genSaltSync(Number(process.env.saltRounds)); // 솔트 생성
    return bcrypt.hashSync(password, salt); // salt를 자동으로 생성
}

// 2. 원본 비밀번호와 해시된 비밀번호가 일치하는지 확인하는 함수(같은지, 다른지만 알려줌)
function comparePW(password, hashedPW){
    console.log(hashedPW);
    return bcrypt.compareSync(password, hashedPW)
}


module.exports = {
    hashPW,
    comparePW,
};