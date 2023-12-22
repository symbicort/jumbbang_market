const tokenModel = require('../model/token');
const jwt = require('jsonwebtoken');

const makeToken = (userid) => {
    const token = jwt.sign({userId: userid}, process.env.JWT_ACCESS_KEY, { expiresIn: "1m" });
    return token;
};

const makeRefreshToken = (userid) => {
    try {
        const refToken = jwt.sign({userId: userid}, process.env.JWT_REFRESH_KEY, {
            expiresIn: "7d",
        });

        const result = tokenModel.updateOne(
            { user_id: userid },
            { $set: { user_id: userid, refreshToken: refToken } },
            { upsert: true }
        ).exec();
        
        console.log('make refresh token complete', result);

        return refToken;
    } catch (error) {
        console.error('upload to token db error', error);
        throw error; // 또는 다른 처리 방식을 선택할 수 있습니다.
    }
};

// 엑세스 토큰 만료 여부 확인
async function verifyToken(accessToken, refToken) {
    console.log('function verifyToken', accessToken, refToken);

    try {
        const verify = jwt.verify(accessToken, process.env.JWT_ACCESS_KEY);
        console.log('액세스 토큰 유효 정보', verify);
        return { token: accessToken, userid: verify.userId };
    } catch (err) {
        console.log(err.name);
        if (err.name == 'TokenExpiredError') {
            try {
                const user = await tokenModel.findOne({ refreshToken: refToken }).lean();
                console.log('리프레시 토큰 검색 결과', user.user_id);

                const refTokenVerify = await verifyRefreshToken(user.user_id);
                console.log('리프레시 토큰 유효성 조회', refTokenVerify.result);

                if (refTokenVerify.result) {
                    return { token: makeToken(user.user_id), userid: user.user_id };
                } else {
                    return { token: undefined };
                }
            } catch (err) {
                console.error(err);
            }
        } else {
            console.error('verify error', err);
            throw err; // 에러 처리 추가
        }
    }
}

async function verifyRefreshToken(userid) {
    try {
        const result = await tokenModel.findOne({ user_id: userid }).lean();
        console.log('fun refresh token', result.refreshToken);

        const verify = jwt.verify(result.refreshToken, process.env.JWT_REFRESH_KEY);
        console.log('refresh 토큰 verify 성공', verify);

        return { result: true };
    } catch (err) {
        if (err.name == 'TokenExpiredError') {
            return { result: false };
        }
        console.error('verifyRefresh token fail verify', err);
        return { result: false };
    }
}

module.exports = { makeToken, makeRefreshToken, verifyToken }; 