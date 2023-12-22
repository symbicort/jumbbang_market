const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const chatsSchema = new Schema(
    {
        roomId: {
            type: Schema.Types.ObjectId,
            ref: "chatrooms",
            require: true,
        },
        sendId: {
            type: String,
            require: true,
        },
        msg: {
            type: String,
            require: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("chats", chatsSchema);
