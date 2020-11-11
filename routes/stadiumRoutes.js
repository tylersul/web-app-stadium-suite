const express              = require('express'),
      router               = express.Router(),
      catchAsync           = require('../utils/catchAsync'),
      ExpressError         = require('../utils/expressError'),
      { stadiumJoiSchema } = require('../schemas.js'),
      { isLoggedIn }       = require('../middleware');

const Stadium  = require('../models/stadium');
const Review   = require('../models/review');


const validateStadium = (req, res, next) => {
    
    const { error } = stadiumJoiSchema.validate(req.body);

    if (error) {
        //details is array of objects
        const message = error.details.map(el => el.message).join(',');
        throw new ExpressError(message, 400);
    } else {
        next();
    }
}

// Stadium Routes
router.get('/', async (req, res) => {
    const stadiums = await Stadium.find({});
    res.render('stadiums/index', { stadiums });
});

// Create New Stadium Routes
router.get('/new', isLoggedIn, (req, res) => {
    res.render('stadiums/new');
});

router.post('/', validateStadium, catchAsync(async (req, res) => {
    // if(!req.body.stadium) throw new ExpressError('Invalid Stadium Data', 400);
    const stadium = new Stadium(req.body.stadium);
    await stadium.save();
    req.flash('success', 'Successfully added a new stadium!');
    res.redirect(`/stadiums/${stadium._id}`);
}));

router.get("/:id", catchAsync(async (req, res) => {
    const stadium = await Stadium.findById(req.params.id).populate('reviews');
    if (!stadium) {
        req.flash('error', 'Stadium not found');
        return res.redirect('/stadiums');
    }
    res.render("stadiums/show", { stadium });
}));

router.get('/:id/edit', isLoggedIn, catchAsync(async (req, res) => {
    const stadium = await Stadium.findById(req.params.id);
    if (!stadium) {
        req.flash('error', 'Stadium not found');
        return res.redirect('/stadiums');
    }
    res.render("stadiums/edit", { stadium });
}));

router.put('/:id', isLoggedIn, validateStadium, catchAsync(async (req, res) => {
    const { id } = req.params; //destructured
    const stadium = await Stadium.findByIdAndUpdate(id, { ...req.body.stadium }) //spread
    req.flash('success', 'Successfully updated stadium');
    res.redirect(`/stadiums/${stadium._id}`);
}));

router.delete('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const stadium = await Stadium.findByIdAndDelete(id, { ...req.body.stadium});
    req.flash('success', 'Successfully deleted stadium');
    res.redirect('/stadiums');
}));

module.exports = router;