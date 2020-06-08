const multer = require('multer');

const MIM_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images')
    },
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_');
        const extensions = MIM_TYPES[file.mimetype];
        callback(null, name + Date.now() + '.' + extensions);
    }
});

module.exports = multer({ storage }).single('image');