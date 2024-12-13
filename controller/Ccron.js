const marketModel = require("../model/market");

async function processPosts() {
    try {
        // 현재 시간
        const currentDate = new Date();

        const postsToUpdate = await marketModel.find({
            dateLimit: { $lte: currentDate },
        });

        for (const post of postsToUpdate) {
            console.log(`게시물 ID ${post._id}의 dateLimit이 지나 상태값 변경`);

            await marketModel.findByIdAndUpdate(
                post._id,
                { $set: { state: 3 } },
                { new: true }
            );
        }
    } catch (error) {
        console.error("에러 발생:", error);
    }
}

module.exports = { processPosts };
