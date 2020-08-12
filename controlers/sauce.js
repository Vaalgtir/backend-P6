const Sauce = require('../models/sauce');
const jwt = require('jsonwebtoken');
const fs = require('fs')

const Error = require('../security/error');

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
        .catch(error => Error.errorManagement(res, 400, error));
}

exports.showAll = (req, res, next) => {
    Sauce.find()
        .then(all => res.status(200).json(all))
        .catch(error => Error.errorManagement(res, 400, error));
}

exports.showOne = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => Error.errorManagement(res, 404, error));
}

exports.modifySauce = (req, res, next) => {
    const reqBody = req.file ?
        {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        } : { ...req.body }

    Sauce.updateOne({ _id: req.params.id }, { ...reqBody, _id: req.params.id })
        .then(response => res.status(200).json({ message: response }))
        .catch(error => Error.errorManagement(res, 400, error));
}
 
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({ _id: req.params.id })
                    .then(response => res.status(200).json({ message: response }))
                    .catch(error => Error.errorManagement(res, 400, error));
            })
        })
        .catch(error => Error.errorManagement(res, 500, error));
}

exports.likeDislike = (req, res, next) => {
    const userId = req.body.userId;
    const like = req.body.like;

    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            if (like == -1) {
                if (!sauce.usersDisliked.includes(userId)) {
                    // => l'ajouter à la bonne tab
                    Sauce.updateOne({ _id: req.params.id }, { $push: { usersDisliked: userId }, $inc: { dislikes: 1 } })
                        .then(() => res.status(200).json({ message: 'user ajouté a usersDisliked' }))
                        .catch(error => Error.errorManagement(res, 500, error));
                } else {
                    // => renvoi "produit deja liké/disliké"
                    return (res.status(400).json({ message: 'produit deja liké/disliké' }));
                }
                if (sauce.usersLiked.includes(userId)) {
                    // => suppr du tab userLiked
                    Sauce.updateOne({ _id: req.params.id }, { $pull: { usersLiked: userId }, $inc: { likes: -1 } })
                        .then(() => res.status(200).json({ message: 'user supprimé de usersLiked' }))
                        .catch(error => Error.errorManagement(res, 500, error));
                }

            } else if (like == 0) {
                // => l'enlever du tab correspondant
                if (sauce.usersLiked.includes(userId)) {
                    // => suppr du tab userLiked
                    Sauce.updateOne({ _id: req.params.id }, { $pull: { usersLiked: userId }, $inc: { likes: -1 } })
                        .then(() => res.status(200).json({ message: 'user supprimé de usersLiked' }))
                        .catch(error => Error.errorManagement(res, 500, error));
                }
                if (sauce.usersDisliked.includes(userId)) {
                    // => suppr du tab userDisliked
                    Sauce.updateOne({ _id: req.params.id }, { $pull: { usersDisliked: userId }, $inc: { dislikes: -1 } })
                        .then(() => res.status(200).json({ message: 'user supprimé de usersDisliked' }))
                        .catch(error => Error.errorManagement(res, 500, error));
                }

            } else if (like == 1) {
                if (!sauce.usersLiked.includes(userId)) {
                    // => l'ajouter à la bonne tab
                    Sauce.updateOne({ _id: req.params.id }, { $push: { usersLiked: userId }, $inc: { likes: 1 } })
                        .then(() => res.status(200).json({ message: 'user ajouté a usersLiked' }))
                        .catch(error => Error.errorManagement(res, 500, error));
                } else {
                    // => renvoi "produit deja liké/disliké"
                    return res.status(400).json({ message: 'produit deja liké/disliké' });
                }
                if (sauce.usersDisliked.includes(userId)) {
                    // => suppr du tab userDisliked
                    Sauce.updateOne({ _id: req.params.id }, { $pull: { usersDisliked: userId }, $inc: { dislikes: -1 } })
                        .then(() => res.status(200).json({ message: 'user supprimé de usersDisliked' }))
                        .catch(error => Error.errorManagement(res, 500, error));
                }
            }
        })
        .catch(error => Error.errorManagement(res, 404, error));
}