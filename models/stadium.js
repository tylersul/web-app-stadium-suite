const mongoose = require('mongoose'),
      Schema   = mongoose.Schema;

const StadiumSchema = new Schema({
    name: String,
    avgPrice: String,
    description: String,
    location: String
});

module.exports = mongoose.model('Stadium', StadiumSchema);