const express = require('express');
const Product = require('../models/Product');
const isAuth = require('../middleware/is-auth');
const { sendNotification } = require('../utils/telegram');

const router = express.Router();

router.get('/', async (req, res) => {
    const products = await Product.findAll();
    res.render('index', { products, pageTitle: 'Shop', isAuthenticated: req.session.isLoggedIn, user: req.session.user });
});

router.post('/add-to-cart', isAuth, async (req, res) => {
    const prodId = req.body.productId;
    const product = await Product.findByPk(prodId);
    
    // Gestione semplificata carrello salvato in sessione
    if (!req.session.cart) {
        req.session.cart = [];
    }
    req.session.cart.push(product);
    
    // Invia notifica Telegram
    sendNotification(`🛒 L'utente ${req.session.user.email} ha aggiunto al carrello: ${product.title} (€${product.price})`);
    
    res.redirect('/');
});

module.exports = router;