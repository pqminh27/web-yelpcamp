const express = require('express');
const passport = require('passport');
const router = express.Router();
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');

router.get('/register', (req, res) => {
    res.render('../views/users/register.ejs');
});

router.post('/register', catchAsync(async(req, res, next) => {
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
}));
router.get('/login', async(req, res) => {
    res.render('users/login')
});

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), async(req, res) => {
    req.flash('success', 'Welcome back');
    const redirectUrl = req.session.returnToUrl || '/campgrounds';
    delete req.session.returnToUrl;
    res.redirect(redirectUrl);
});

router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', 'Log out successfully');
    res.redirect('/campgrounds');
})
module.exports = router;