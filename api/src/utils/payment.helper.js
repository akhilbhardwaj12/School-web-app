// =====================================================
// Payment Helper Utility
// =====================================================

const crypto = require('crypto');
const Razorpay = require('razorpay');

// Initialize Razorpay
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Convert rupees to paise
const convertToPaise = (amount) => {
    if (!amount || Number(amount) <= 0) {
        throw new Error('Payment amount must be greater than 0');
    }

    return Math.round(Number(amount) * 100);
};

// Convert paise to rupees
const convertToRupees = (amount) => {
    if (amount === undefined || amount === null) {
        throw new Error('Payment amount is required');
    }

    return Number(amount) / 100;
};

// Create Razorpay order
const createPaymentOrder = async ({
    amount,
    currency = 'INR',
    receipt,
    notes = {},
}) => {
    try {
        const order = await razorpay.orders.create({
            amount: convertToPaise(amount),
            currency,
            receipt,
            notes,
        });

        return {
            success: true,
            order,
        };
    } catch (error) {
        console.error('Payment order creation failed:', error.message);

        return {
            success: false,
            message: error.message,
        };
    }
};

// Verify Razorpay payment signature
const verifyPaymentSignature = ({
    orderId,
    paymentId,
    signature,
}) => {
    if (!orderId || !paymentId || !signature) {
        return false;
    }

    const generatedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(`${orderId}|${paymentId}`)
        .digest('hex');

    return generatedSignature === signature;
};

module.exports = {
    razorpay,
    convertToPaise,
    convertToRupees,
    createPaymentOrder,
    verifyPaymentSignature,
};