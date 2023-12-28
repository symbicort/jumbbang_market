const marketModel = require("../model/market");

async function processPosts() {
    try {
        // 현재 시간
        const currentDate = new Date();

        const postsToUpdate = await marketModel.find({ dateLimit: { $lte: currentDate } });
        console.log('시간 넘은 데이터 있는지', postsToUpdate);ß

        for (const post of postsToUpdate) {
            console.log(`게시물 ID ${post._id}의 dateLimit이 지나 상태값 변경`);

            await marketModel.findByIdAndUpdate(post._id, { $set: { state: 3 } }, { new: true });
        }
        console.log('게시물 처리 완료');
    } catch (error) {
        console.error('에러 발생:', error);
    }
}

module.exports = {processPosts};
