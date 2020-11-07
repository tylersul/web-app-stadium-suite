const express              = require('express'),
      router               = express.Router({ mergeParams: true }),
      { reviewJoiSchema } = require('../schemas.js')

const       catchAsync           = require('../utils/catchAsync'),
            ExpressError         = require('../utils/expressError');

const Stadium  = require('../models/stadium');
const Review   = require('../models/review');

const validateReview = (req, res, next) => {
    
    const { error } = reviewJoiSchema.validate(req.body);

    if(error) {
        //details is array of objects
        const message = error.details.map(el => el.message).join(',');
        throw new ExpressError(message, 400);
    } else {
        next();
    }
}


router.post('/', validateReview, catchAsync(async (req, res) => {
    const stadium = await Stadium.findById(req.params.id);
    const review = new Review(req.body.review);
    stadium.reviews.push(review);
    await review.save();
    await stadium.save();
    res.redirect(`/stadiums/${stadium._id}`);
}));

router.delete('/:reviewId', catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Stadium.findByIdAndUpdate(id, { $pull: { review: reviewId } });
    await Review.findByIdAndDelete(req.params.reviewId);
    res.redirect(`/stadiums/${id}`);
}));

module.exports = router;