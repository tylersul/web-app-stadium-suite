const express        = require('express'),
      app            = express(),
      path           = require('path'),
      mongoose       = require('mongoose'),
      ExpressError   = require('./utils/expressError'),
      methodOverride = require('method-override'),
      session        = require('express-session'),
      flash          = require('connect-flash'),
      passport       = require('passport'),
      localStrategy  = require('passport-local'),
      ejsMate        = require('ejs-mate'),
      db             = mongoose.connection;


const User = require('./models/user');

// Route Imports
const stadiumRoutes = require('./routes/stadiumRoutes');
const reviewRoutes  = require('./routes/reviewRoutes');
const userRoutes    = require('./routes/userRoutes');

// Mongo Connection
mongoose.connect('mongodb://localhost:27017/stadium-suite', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

// EJS Templating
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');

// Views Directory
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// Session Configuration
const sessionConfig = {
    secret: 'notsosecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,                                     // XSS prevention
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,      // 1 week
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig));

// Flash 
app.use(flash());


// Pasport auth setup
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Set Locals for all routes
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

// Route Imports
app.use('/stadiums', stadiumRoutes);
app.use('/stadiums/:id/reviews', reviewRoutes);
app.use('/', userRoutes);

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