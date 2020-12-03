const express              = require('express'),
      router               = express.Router(),
      catchAsync           = require('../utils/catchAsync'),
      { isLoggedIn, isAuthor, validateStadium }       = require('../middleware');

const Stadium  = require('../models/stadium');
const Review   = require('../models/review');

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
    stadium.author = req.user._id;
    await stadium.save();
    req.flash('success', 'Successfully added a new stadium!');
    res.redirect(`/stadiums/${stadium._id}`);
}));

router.get("/:id", catchAsync(async (req, res) => {
    const stadium = await (await Stadium.findById(req.params.id).populate({path: 'reviews', populate: { path: 'author'}}).populate('author'));
    if (!stadium) {
        req.flash('error', 'Stadium not found');
        return res.redirect('/stadiums');
    }
    res.render("stadiums/show", { stadium });
}));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const stadium = await Stadium.findById(req.params.id);
    if (!stadium) {
        req.flash('error', 'Stadium not found');
        return res.redirect('/stadiums');
    }
    res.render("stadiums/edit", { stadium });
}));

router.put('/:id', isLoggedIn, isAuthor, validateStadium, catchAsync(async (req, res) => {
    const { id } = req.params; //destructured
    const stadium = await Stadium.findByIdAndUpdate(id, { ...req.body.stadium }) //spread
    req.flash('success', 'Successfully updated stadium');
    res.redirect(`/stadiums/${stadium._id}`);
}));

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    const stadium = await Stadium.findByIdAndDelete(id, { ...req.body.stadium});
    req.flash('success', 'Successfully deleted stadium');
    res.redirect('/stadiums');
}));

module.exports = router;