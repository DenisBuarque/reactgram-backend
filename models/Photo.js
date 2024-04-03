const mongoose = require('mongoose');
const { Schema } = mongoose;

const Photo = mongoose.model(
    'Photo',
    new Schema ({
        image: {
            type: String,
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        likes: {
            type: Array
        },
        comments: {
            type: Array,
        },
        userId: {
            type: mongoose.ObjectId,
        },
        userName: {
            type: String
        }
    },
    { timestamp: true },
    )
);

module.exports = Photo;