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
            // type: Schema.Types.ObjectId,
            // ref: "markets",
            // require: true,
            type: String,
            unique: true,
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

    // Set updatedAt to the current UTC time
    this.updatedAt = currentDate;

    // Set createdAt only if it's not already set (i.e., when creating a new document)
    if (!this.createdAt) {
        this.createdAt = currentDate;
    }

    next();
});

module.exports = mongoose.model("chatrooms", chatroomsSchema);
