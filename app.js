const express  = require('express'),
      app      = express(),
      path     = require('path'),
      mongoose = require('mongoose'),
      db       = mongoose.connection;

const Stadium  = require('./models/stadium');

mongoose.connect('mongodb://localhost:27017/stadium-suite', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.get('/', (req, res) => {
    res.render('home');
});

app.listen(3000, () => {
    console.log('Serving app on port 3000');
});