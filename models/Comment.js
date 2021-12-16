const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let CommentSchema = new Schema ({
    commentFor: {
        type: String,
        required: true,
        trim: true
    },
    body: {
        type: String,
        required: true
    },
    user: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("comments", CommentSchema);