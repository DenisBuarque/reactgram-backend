const mongoose = require('mongoose');
const { Schema } = mongoose;

const User = mongoose.model(
    'User',
    new Schema ({
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        profileImage: {
            type: String,
        },
        bio: {
            type: String,
        }
    },
    { timestamp: true },
    )
);

module.exports = User;