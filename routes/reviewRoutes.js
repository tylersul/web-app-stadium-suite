const express              = require('express'),
      router               = express.Router({ mergeParams: true });
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');

const       catchAsync           = require('../utils/catchAsync'),
            ExpressError         = require('../utils/expressError');

const Stadium  = require('../models/stadium');
const Review   = require('../models/review');

const reviews = require('../controllers/reviews');


/*** Review Routes ***/
// Create Review - POST
router.post('/', validateReview, isLoggedIn, catchAsync(reviews.createReview));

// Delete Review - DELETE
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview));

module.exports = router;