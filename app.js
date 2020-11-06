const express        = require('express'),
      app            = express(),
      path           = require('path'),
      mongoose       = require('mongoose'),
      { stadiumJoiSchema, reviewJoiSchema } = require('./schemas.js'),
      catchAsync     = require('./utils/catchAsync'),
      ExpressError   = require('./utils/expressError'),
      methodOverride = require('method-override'),
      ejsMate        = require('ejs-mate'),
      db             = mongoose.connection;

const Joi = require('joi');
const Stadium  = require('./models/stadium'),
      Review   = require('./models/review');


mongoose.connect('mongodb://localhost:27017/stadium-suite', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true}));
app.use(methodOverride('_method'));

const validateStadium = (req, res, next) => {
    
    const { error } = stadiumJoiSchema.validate(req.body);

    if(error) {
        //details is array of objects
        const message = error.details.map(el => el.message).join(',');
        throw new ExpressError(message, 400);
    } else {
        next();
    }
}

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

// Routes
// Root Routes
app.get('/', (req, res) => {
    res.render('home');
});

// Stadium Routes
app.get("/stadiums", async (req, res) => {
    const stadiums = await Stadium.find({});
    res.render('stadiums/index', { stadiums });
});

// Create New Stadium Routes
app.get('/stadiums/new', (req, res) => {
    res.render('stadiums/new');
});

app.post('/stadiums', validateStadium, catchAsync(async (req, res) => {
    // if(!req.body.stadium) throw new ExpressError('Invalid Stadium Data', 400);
    const stadium = new Stadium(req.body.stadium);
    await stadium.save();
    res.redirect(`/stadiums/${stadium._id}`);
}));

app.get("/stadiums/:id", catchAsync(async (req, res) => {
    const stadium = await Stadium.findById(req.params.id).populate('reviews');
    res.render("stadiums/show", { stadium });
}));

app.get('/stadiums/:id/edit', catchAsync(async (req, res) => {
    const stadium = await Stadium.findById(req.params.id);
    res.render("stadiums/edit", { stadium });
}));

app.put('/stadiums/:id', validateStadium, catchAsync(async (req, res) => {
    const { id } = req.params; //destructured
    const stadium = await Stadium.findByIdAndUpdate(id, { ...req.body.stadium }) //spread
    res.redirect(`/stadiums/${stadium._id}`);
}));

app.delete('/stadiums/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const stadium = await Stadium.findByIdAndDelete(id, { ...req.body.stadium});
    res.redirect('/stadiums');
}));

app.post('/stadiums/:id/reviews', validateReview, catchAsync(async (req, res) => {
    const stadium = await Stadium.findById(req.params.id);
    const review = new Review(req.body.review);
    stadium.reviews.push(review);
    await review.save();
    await stadium.save();
    res.redirect(`/stadiums/${stadium._id}`);
}));

app.delete('/stadiums/:id/reviews/:reviewId', catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Stadium.findByIdAndUpdate(id, { $pull: { review: reviewId } });
    await Review.findByIdAndDelete(req.params.reviewId);
    res.redirect(`/stadiums/${id}`);
}))

// 404
app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
});

// Error Handler
app.use((err, req, res, next) => {
    const { statusCode = 500, message = 'Something went wrong.' } = err;
    if (!err.message) err.message = 'Oh no, something went wrong!';
    res.status(statusCode).render('errors', { err });
});

// Listener
app.listen(3000, () => {
    console.log('Serving app on port 3000');
});