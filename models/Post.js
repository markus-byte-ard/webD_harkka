const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Simple schema for posts 
// ideal way would be to reference users
let PostSchema = new Schema ({
    title: {
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

module.exports = mongoose.model("posts", PostSchema);