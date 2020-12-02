const ExpressError         = require('./utils/expressError'),
      { stadiumJoiSchema, reviewJoiSchema } = require('./schemas.js');

const Stadium  = require('./models/stadium');


module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash('error', 'You must be logged in to do this.');
        return res.redirect('/login');
    }
    next();
}

module.exports.validateStadium = (req, res, next) => {
    
    const { error } = stadiumJoiSchema.validate(req.body);

    if (error) {
        //details is array of objects
        const message = error.details.map(el => el.message).join(',');
        throw new ExpressError(message, 400);
    } else {
        next();
    }
}

module.exports.isAuthor = async(req, res, next) => {
    const { id } = req.params;
    const stadium = await Stadium.findById(id);
    if (!stadium.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that.');
        return res.redirect(`/stadiums/${id}`);
    }
    next();
}

module.exports.validateReview = (req, res, next) => {
    
    const { error } = reviewJoiSchema.validate(req.body);

    if(error) {
        //details is array of objects
        const message = error.details.map(el => el.message).join(',');
        throw new ExpressError(message, 400);
    } else {
        next();
    }
}