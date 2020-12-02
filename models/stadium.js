const mongoose = require('mongoose'),
      Schema   = mongoose.Schema;
      Review   = require('./review');

const StadiumSchema = new Schema({
    name: String,
    avgPrice: Number,
    description: String,
    location: String,
    image: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});

StadiumSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Stadium', StadiumSchema);