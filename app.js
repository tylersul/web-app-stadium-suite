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

const stadiumRoutes = require('./routes/stadiumRoutes');

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

app.use('/stadiums', stadiumRoutes);

// Routes
// Root Routes
app.get('/', (req, res) => {
    res.render('home');
});

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