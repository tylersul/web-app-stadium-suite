const express              = require('express'),
      router               = express.Router({ mergeParams: true });
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');

const       catchAsync           = require('../utils/catchAsync'),
            ExpressError         = require('../utils/expressError');

const Stadium  = require('../models/stadium');
const Review   = require('../models/review');

router.post('/', validateReview, isLoggedIn, catchAsync(async (req, res) => {
    const stadium = await Stadium.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    stadium.reviews.push(review);
    await review.save();
    await stadium.save();
    req.flash('success', 'Added review!');
    res.redirect(`/stadiums/${stadium._id}`);
}));

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Stadium.findByIdAndUpdate(id, { $pull: { review: reviewId } });
    await Review.findByIdAndDelete(req.params.reviewId);
    req.flash('success', 'Successfully deleted review.');
    res.redirect(`/stadiums/${id}`);
}));

module.exports = router;