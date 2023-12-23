const mongoose = require('mongoose');
const { Schema } = mongoose;

const marketSchema = new Schema({
    userid: {
        type: String,
    },
    category: {
        type: String,
        required: true,
    },
    state:{
        type: Number,
        default: 1
    },
    subject: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true
    },
    priceFirst: {
        type: Number,
        required: true
    },
    priceLast:{
        type: Number
    },
    priceDirect:{
        type: Number,
        required: true
    },
    dateLimit:{
        type: Date,
        required: true
    },
    complete_stat: {
        type: Number,
        required: true,
        default: 1
    },
    hit: {
        type: Number,
        required: true,
        default: 0
    },
    bookmark_hit: {
        type: Number,
        required: true,
        default: 0
    },
    images: {
        type: [String]
    },
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'user', 
    },
}, {
    timestamps: true 
});

module.exports = mongoose.model('market', marketSchema);
