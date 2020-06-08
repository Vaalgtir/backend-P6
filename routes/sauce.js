const express = require('express');

const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-confg');

const sauceCtl = require('../controlers/sauce')

router.post('/', auth, multer, sauceCtl.createSauce);
router.get('/', auth, sauceCtl.showAll);
router.get('/:id', auth, sauceCtl.showOne);
router.put('/:id', auth, multer, sauceCtl.modifySauce);
router.delete('/:id', auth, sauceCtl.deleteSauce);
router.post('/:id/like', auth, sauceCtl.likeDislike);

module.exports = router;