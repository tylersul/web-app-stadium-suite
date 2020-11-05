const mongoose = require('mongoose'),
      Schema   = mongoose.Schema;
      Review   = require('./review');

const StadiumSchema = new Schema({
    name: String,
    avgPrice: Number,
    description: String,
    location: String,
    image: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});

module.exports = mongoose.model('Stadium', StadiumSchema);