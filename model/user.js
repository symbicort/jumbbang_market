const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
    userid: {
        type: String,
        required: true, // null 여부
        unique: true, // 유니크 여부
    },
    pw: {
        type: String, // Int32가 아니다. 기본 자바스크립트에는 존재하지 않으니 넘버로 해줘야 한다.
        required: true,
    },
    nick: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
    },
    contact: {
        type: String,
    },
    address: {
        type: String,
    },
    image: {
        type: String,
    },
    boughtItem: {
        type: [String]
    },
    saleItem: {
        type: [String]
    },
    WishlistItem: {
        type: [String]
    }
});

module.exports = mongoose.model("user", userSchema);
