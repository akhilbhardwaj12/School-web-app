// =====================================================
// Generate Random Password Utility
// =====================================================

const crypto = require('crypto');

const generatePassword = (length = 12) => {
    const characters =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
        'abcdefghijklmnopqrstuvwxyz' +
        '0123456789' +
        '!@#$%^&*';

    let password = '';

    const randomBytes = crypto.randomBytes(length);

    for (let i = 0; i < length; i++) {
        password += characters[randomBytes[i] % characters.length];
    }

    return password;
};

module.exports = {
    generatePassword,
};