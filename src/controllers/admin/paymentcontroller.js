// =====================================================
// Payment Controller
// =====================================================

const {
    createPaymentOrder,
    verifyPaymentSignature,
    razorpay,
} = require('../utils/payment.helper');

const {
    sendPaymentSuccessEmail,
    sendPaymentFailedEmail,
} = require('../utils/payment.email');

// =====================================================
// Create Payment Order
// =====================================================

const createOrder = async (req, res, next) => {
    try {
        const {
            amount,
            receipt,
            notes = {},
        } = req.body;

        if (!amount || Number(amount) <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Valid payment amount is required',
            });
        }

        const result = await createPaymentOrder({
            amount,
            receipt: receipt || `FEE_${Date.now()}`,
            notes,
        });

        if (!result.success) {
            return res.status(500).json({
                success: false,
                message: result.message,
            });
        }

        return res.status(201).json({
            success: true,
            message: 'Payment order created successfully',
            data: result.order,
        });
    } catch (error) {
        next(error);
    }
};

// =====================================================
// Verify Payment
// =====================================================

const verifyPayment = async (req, res, next) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            studentName,
            email,
            amount,
        } = req.body;

        if (
            !razorpay_order_id ||
            !razorpay_payment_id ||
            !razorpay_signature
        ) {
            return res.status(400).json({
                success: false,
                message: 'Payment verification details are required',
            });
        }

        const isValid = verifyPaymentSignature({
            orderId: razorpay_order_id,
            paymentId: razorpay_payment_id,
            signature: razorpay_signature,
        });

        if (!isValid) {
            if (email) {
                await sendPaymentFailedEmail({
                    to: email,
                    studentName: studentName || 'Student',
                    amount: amount || 0,
                    reason: 'Invalid payment signature',
                });
            }

            return res.status(400).json({
                success: false,
                message: 'Invalid payment signature',
            });
        }

        // TODO:
        // Save payment information to PaymentModel here.

        if (email) {
            await sendPaymentSuccessEmail({
                to: email,
                studentName: studentName || 'Student',
                amount: amount || 0,
                transactionId: razorpay_payment_id,
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Payment verified successfully',
            data: {
                orderId: razorpay_order_id,
                paymentId: razorpay_payment_id,
            },
        });
    } catch (error) {
        next(error);
    }
};

// =====================================================
// Get Payment Details
// =====================================================

const getPaymentById = async (req, res, next) => {
    try {
        const { paymentId } = req.params;

        if (!paymentId) {
            return res.status(400).json({
                success: false,
                message: 'Payment ID is required',
            });
        }

        const payment = await razorpay.payments.fetch(paymentId);

        return res.status(200).json({
            success: true,
            data: payment,
        });
    } catch (error) {
        next(error);
    }
};

// =====================================================
// Get Razorpay Order
// =====================================================

const getOrderById = async (req, res, next) => {
    try {
        const { orderId } = req.params;

        if (!orderId) {
            return res.status(400).json({
                success: false,
                message: 'Order ID is required',
            });
        }

        const order = await razorpay.orders.fetch(orderId);

        return res.status(200).json({
            success: true,
            data: order,
        });
    } catch (error) {
        next(error);
    }
};

// =====================================================
// Capture Payment
// =====================================================

const capturePayment = async (req, res, next) => {
    try {
        const {
            paymentId,
            amount,
            currency = 'INR',
        } = req.body;

        if (!paymentId || !amount) {
            return res.status(400).json({
                success: false,
                message: 'Payment ID and amount are required',
            });
        }

        const amountInPaise = Math.round(Number(amount) * 100);

        const payment = await razorpay.payments.capture(
            paymentId,
            amountInPaise,
            currency
        );

        return res.status(200).json({
            success: true,
            message: 'Payment captured successfully',
            data: payment,
        });
    } catch (error) {
        next(error);
    }
};

// =====================================================
// Export Controllers
// =====================================================

module.exports = {
    createOrder,
    verifyPayment,
    getPaymentById,
    getOrderById,
    capturePayment,
};