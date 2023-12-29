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
            ref: "markets",
            type: String,
            require: true,
        },
    },
    {
        timestamps: true,
    }
);
module.exports = mongoose.model("chatrooms", chatroomsSchema);
