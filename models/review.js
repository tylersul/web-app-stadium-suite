// Library Imports 
const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

// Schema definition
const ReviewSchema = new Schema({
    body: String,
    rating: Number,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

// Model Export
module.exports = mongoose.model("Review", ReviewSchema);