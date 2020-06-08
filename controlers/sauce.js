const Sauce = require('../models/sauce');
const jwt = require('jsonwebtoken');
const fs = require('fs')

exports.createSauce = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    const tokenDecoded = jwt.verify(token, 'RANDOM KEY TO CHANGE');
    const userId = tokenDecoded.userId;

    const sauceObject = JSON.parse(req.body.sauce);

    const sauce = new Sauce({
        userId: userId,
        name: sauceObject.name,
        manufacturer: sauceObject.manufacturer,
        description: sauceObject.description,
        mainPepper: sauceObject.mainPepper,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        heat: sauceObject.heat
    });

    sauce.save()
        .then(response => res.status(201).json({ message: response }))
        .catch(error => res.status(400).json({ error }));
}

exports.showAll = (req, res, next) => {
    Sauce.find()
        .then(all => res.status(200).json(all))
        .catch(error => res.status(400).json({ error }))
}

exports.showOne = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));
}

exports.modifySauce = (req, res, next) => {
    const reqBody = req.file ?
        {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        } : { ...req.body }

    Sauce.updateOne({ _id: req.params.id }, { ...reqBody, _id: req.params.id })
        .then(response => res.status(200).json({ message: response }))
        .catch(error => res.status(400).json({ error }));
}

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            console.log('good enough');
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({ _id: req.params.id })
                    .then(response => res.status(200).json({ message: response }))
                    .catch(error => res.status(400).json({ error }));
            })
        })
        .catch(error => res.status(500).json({ error }));
};

exports.likeDislike = (req, res, next) => {
    const userId = req.params.id;

    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            if(sauce.usersLiked.includes(userId) && Sauce.usersDisliked.includes(userId)) {

            }
        })
}