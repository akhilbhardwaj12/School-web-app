// =====================================================
// ID Types Utility
// =====================================================

const { Types } = require('mongoose');

// Check if ID is a valid MongoDB ObjectId
const isValidObjectId = (id) => {
    return Types.ObjectId.isValid(id);
};

// Convert ID to MongoDB ObjectId
const toObjectId = (id) => {
    if (!isValidObjectId(id)) {
        return null;
    }

    return new Types.ObjectId(id);
};

module.exports = {
    Types,
    isValidObjectId,
    toObjectId,
};