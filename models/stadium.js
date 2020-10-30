const mongoose = require('mongoose'),
      Schema   = mongoose.Schema;

const StadiumSchema = new Schema({
    name: String,
    avgPrice: Number,
    description: String,
    location: String,
    image: String
});

module.exports = mongoose.model('Stadium', StadiumSchema);