const multer = require('multer');

// Store uploaded files in memory
const storage = multer.memoryStorage();

// Allowed image types
const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/webp'
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(
            new Error(
                'Invalid file type. Only JPG, JPEG, PNG and WEBP images are allowed.'
            ),
            false
        );
    }
};

// Multer configuration
const upload = multer({
    storage,

    fileFilter,

    limits: {
        fileSize: 5 * 1024 * 1024 // 5 MB
    }
});

module.exports = upload;