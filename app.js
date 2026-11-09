const express = require('express');
const session = require('express-session');
const sequelize = require('./utils/db');

const User = require('./models/User');
const Product = require('./models/Product');

const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.urlencoded({ extended: false }));
app.use(session({
    secret: process.env.SESSION_SECRET || 'secret',
    resave: false,
    saveUninitialized: false
}));

app.use(shopRoutes);
app.use(authRoutes);
app.use(adminRoutes);

// Sincronizzazione database e avvio server
sequelize.sync()
    .then(() => {
        app.listen(3000, () => console.log('Server in ascolto sulla porta 3000'));
    })
    .catch(err => console.log(err));