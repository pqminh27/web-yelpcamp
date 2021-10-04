const User = require('../models/user');

module.exports.renderRegister = (req, res) => {
    res.render('../views/users/register.ejs');
};

module.exports.register = async(req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to the page!!!');
            res.redirect('/campgrounds');
        });
    } catch (err) {
        req.flash('error', err.message);
        res.redirect('register');
    }
};

module.exports.renderLogin = async(req, res) => {
    res.render('users/login')
};

module.exports.login = async(req, res) => {
    req.flash('success', 'Welcome back');
    const redirectUrl = req.session.returnToUrl || '/campgrounds';
    delete req.session.returnToUrl;
    res.redirect(redirectUrl);
};

module.exports.logout = (req, res) => {
    req.logout();
    req.flash('success', 'Log out successfully');
    res.redirect('/campgrounds');
};