const mongoose = require('mongoose');
const { Schema } = mongoose;

const tokenSchema = new Schema({
    user_id: {
        type: String,
        required: true
    },
    refreshToken: {
        type: String,
        required: true,
    }
    }, {
        timestamps: true,
    }

)

module.exports = mongoose.model('token', tokenSchema);