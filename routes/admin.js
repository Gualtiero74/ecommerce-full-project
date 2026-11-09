const express = require('express');
const Product = require('../models/Product');
const User = require('../models/User');
const isAdmin = require('../middleware/is-admin');

const router = express.Router();

router.get('/admin/products', isAdmin, async (req, res) => {
    const products = await Product.findAll();
    res.render('admin-products', { products, pageTitle: 'Gestione Prodotti', isAuthenticated: req.session.isLoggedIn, user: req.session.user });
});

router.get('/admin/add-product', isAdmin, (req, res) => {
    res.render('edit-product', { editing: false, pageTitle: 'Aggiungi Prodotto', isAuthenticated: req.session.isLoggedIn, user: req.session.user });
});

router.post('/admin/add-product', isAdmin, async (req, res) => {
    const { title, price, description } = req.body;
    await Product.create({ title, price, description });
    res.redirect('/admin/products');
});

router.get('/admin/edit-product/:productId', isAdmin, async (req, res) => {
    const prodId = req.params.productId;
    const product = await Product.findByPk(prodId);
    res.render('edit-product', { product, editing: true, pageTitle: 'Modifica Prodotto', isAuthenticated: req.session.isLoggedIn, user: req.session.user });
});

router.post('/admin/edit-product', isAdmin, async (req, res) => {
    const { productId, title, price, description } = req.body;
    const product = await Product.findByPk(productId);
    product.title = title;
    product.price = price;
    product.description = description;
    await product.save();
    res.redirect('/admin/products');
});

router.post('/admin/delete-product', isAdmin, async (req, res) => {
    const prodId = req.body.productId;
    const product = await Product.findByPk(prodId);
    await product.destroy();
    res.redirect('/admin/products');
});

router.get('/admin/users', isAdmin, async (req, res) => {
    const users = await User.findAll();
    res.render('admin-users', { users, pageTitle: 'Gestione Profili', isAuthenticated: req.session.isLoggedIn, user: req.session.user });
});

module.exports = router;