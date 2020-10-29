const express  = require('express'),
      app      = express(),
      path     = require('path'),
      mongoose = require('mongoose'),
      methodOverride = require('method-override'),
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

app.use(express.urlencoded({ extended: true}));
app.use(methodOverride('_method'));

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

app.post('/stadiums', async (req, res) => {
    const stadium = new Stadium(req.body.stadium);
    await stadium.save();
    res.redirect(`/stadiums/${stadium._id}`);
})

app.get("/stadiums/:id", async (req, res) => {
    const stadium = await Stadium.findById(req.params.id);
    res.render("stadiums/show", { stadium });
});

app.get('/stadiums/:id/edit', async (req, res) => {
    const stadium = await Stadium.findById(req.params.id);
    res.render("stadiums/edit", { stadium });
})

app.put('/stadiums/:id', async (req, res) => {
    const { id } = req.params; //destructured
    const stadium = await Stadium.findByIdAndUpdate(id, { ...req.body.stadium }) //spread
    res.redirect(`/stadiums/${stadium._id}`);
});

app.delete('/stadiums/:id', async (req, res) => {
    const { id } = req.params;
    const stadium = await Stadium.findByIdAndDelete(id, { ...req.body.stadium});
    res.redirect('/stadiums');
})
// Listener
app.listen(3000, () => {
    console.log('Serving app on port 3000');
});