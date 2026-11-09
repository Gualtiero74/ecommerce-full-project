const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const router = express.Router();

router.get('/login', (req, res) => {
    res.render('login', { pageTitle: 'Login', isAuthenticated: req.session.isLoggedIn, user: req.session.user });
});

router.get('/signup', (req, res) => {
    res.render('signup', { pageTitle: 'Registrazione', isAuthenticated: req.session.isLoggedIn, user: req.session.user });
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.redirect('/login');
        }
        const doMatch = await bcrypt.compare(password, user.password);
        if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save(err => {
                res.redirect('/');
            });
        }
        res.redirect('/login');
    } catch (err) {
        console.log(err);
        res.redirect('/login');
    }
});

router.post('/signup', async (req, res) => {
    const { email, password, role } = req.body;
    try {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.redirect('/signup');
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        const userRole = role === 'admin' ? 'admin' : 'user';
        await User.create({
            email,
            password: hashedPassword,
            role: userRole
        });
        res.redirect('/login');
    } catch (err) {
        console.log(err);
        res.redirect('/signup');
    }
});

router.post('/logout', (req, res) => {
    req.session.destroy(err => {
        res.redirect('/');
    });
});

module.exports = router;