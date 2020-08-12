const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const Error = require('../security/error');

const User = require('../models/User');

exports.createUser = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash
            });

            user.save()
                .then(() => res.status(201).json({ message: 'User créé' }))
                .catch(error => Error.errorManagement(res, 500, error));
        })
        .catch(error => Error.errorManagement(res, 500, error));
};

exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if(!user) {
                return (res.status(404).json({ error: 'Utilisateur non trouvé' }));
            }

            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if(!valid) {
                        return (res.status(401).json({ error: 'Mot de passe erroné' }));
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            'LTWNHGKXTJSSRMPGDEWVUUXGP',
                            { expiresIn: '1h' }
                        )
                    });
                })
                .catch(error => Error.errorManagement(res, 500, error));
        })
        .catch(error => Error.errorManagement(res, 500, error));
}