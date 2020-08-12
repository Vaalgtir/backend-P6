const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const path = require('path')

const app = express();

const userRoute = require('./routes/user');
const sauceRoute = require('./routes/sauce');

// connexion to mongoDB
const crypt = require('./security/crypt');

var user = 'IELASRVQRNHBAYHQN';
var mdp = 'SHHGLOIRMUGVUDKEEW';
// Enter a 2 word key
var key = 'LWVIBDJYYCBUHMVVQYQB IELASRVQRNHBAYHQN';

var cryptedInfos = crypt.crypt(user, mdp, key);
var userCrypted = cryptedInfos.split(' ')[1];
var mdpCrypted = cryptedInfos.split(' ')[0];

mongoose.connect('mongodb+srv://' + userCrypted + ':' + mdpCrypted + '@cluster0-hmimt.gcp.mongodb.net/Projet?retryWrites=true&w=majority',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));
// connexion to mongoDB ***END***

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(bodyParser.json());

app.use('/api/auth', userRoute);
app.use('/api/sauces', sauceRoute);
app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;