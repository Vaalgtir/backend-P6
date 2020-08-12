const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try { 
        const token = req.headers.authorization.split(' ')[1];
        const tokenDecoded = jwt.verify(token, 'LTWNHGKXTJSSRMPGDEWVUUXGP');
        const userId = tokenDecoded.userId;
        if(req.body.userId && req.body.userId !== userId) {
            throw 'invalid user id';
        } else {
            next();
        }
    } catch {
        res.status(401).json({
            error: new Error('Invalid request')
        })
    }
}