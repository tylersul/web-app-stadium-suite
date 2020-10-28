const express = require('express'),
      app     = express(),
      path    = require('path');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.get('/', (req, res) => {
    res.render('home');
});

app.listen(3000, () => {
    console.log('Serving app on port 3000');
});