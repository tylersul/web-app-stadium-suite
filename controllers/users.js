// Imports
const User = require('../models/user');

// Render Register Form
module.exports.renderRegisterForm = (req, res) => {
    res.render('users/register');
}

// Create User
module.exports.createUser = async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) {
                return next(err);
            }
            req.flash('Welcome to StadiumSuite');
            res.redirect('/stadiums');
        });
    } catch (e) {
        req.flash('error', e.message);
        console.log(e);
        res.redirect('register');
    }
}

// Render Login Form
module.exports.renderLoginForm = (req, res) => {
    res.render('users/login');
}

// User login
module.exports.login = (req, res) => {
    req.flash('success', 'Welcome back!');
    const redirectUrl = req.session.returnTo || '/stadiums';
    res.redirect(redirectUrl);
}

// User logout
module.exports.logout = (req, res) => {
    req.logout();
    req.flash('success', 'Successfully logged out.')
    res.redirect('/stadiums')
}