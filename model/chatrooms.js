const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const chatroomsSchema = new Schema(
    {
        sendId: {
            type: String,
            unique: false,
            require: true,
        },
        takeId: {
            require: true,
            type: String,
            unique: false,
        },
        productId: {
            // markets 스키마와 연결
            type: Schema.Types.ObjectId,
            ref: "markets",
            type: String,
            require: true,
        },
    },
    {
        timestamps: true,
    }
);

// 저장하기 전에 roomid를 _id 값으로 설정
// chatroomsSchema.pre("save", function (next) {
//     this.roomid = this._id;
//     next();
// });

chatroomsSchema.pre("save", function (next) {
    const currentDate = new Date();
    this.updatedAt = currentDate;
    if (!this.createdAt) {
        this.createdAt = currentDate;
    }
    next();
});

module.exports = mongoose.model("chatrooms", chatroomsSchema);
