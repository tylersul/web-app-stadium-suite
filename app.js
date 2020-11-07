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
const reviewRoutes  = require('./routes/reviewRoutes');

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



app.use('/stadiums', stadiumRoutes);
app.use('/stadiums/:id/reviews', reviewRoutes);

// Routes
// Root Routes
app.get('/', (req, res) => {
    res.render('home');
});

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