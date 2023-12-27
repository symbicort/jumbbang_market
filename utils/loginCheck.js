const { verifyToken } = require('../utils/token')

async function loginCheck(token, refreshToken){
        if(!token || !refreshToken){
            return {userid: undefined}
        } else{
            try{
                const decodedjwt = await verifyToken(token, refreshToken) ;

                if(decodedjwt.token != undefined){
                    return  {userid: decodedjwt.userid};
                } else{
                    return {userid: undefined}
                }
            } catch(err) {
                console.error('로그인 여부 확인 중 에러', err);
            }
        }
}   

module.exports = { loginCheck }; 