const mongoose = require('mongoose');
const Stadium = require('../models/stadium');
const Cities = require('./cities');

mongoose.connect('mongodb://localhost:27017/stadium-suite', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const seedDB = async () => {
    await Stadium.deleteMany({});
    for (let i = 0; i < Cities.length; i++) {
        const stad = new Stadium({
            location: `${Cities[i].city}`
        });
        await stad.save();
    }
}

seedDB().then(() => {
    db.close();
});