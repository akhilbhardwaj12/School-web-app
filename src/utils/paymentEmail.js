// =====================================================
// Payment Email Utility
// =====================================================

const { sendEmail } = require('./Mailer');

// Payment success email
const sendPaymentSuccessEmail = async ({
    to,
    studentName,
    amount,
    transactionId,
    paymentDate = new Date(),
}) => {
    const formattedDate = new Date(paymentDate).toLocaleDateString(
        'en-IN',
        {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        }
    );

    return await sendEmail({
        to,
        subject: 'Payment Successful - School Management System',

        text: `
Hello ${studentName},

Your payment has been successfully received.

Amount: ₹${amount}
Transaction ID: ${transactionId}
Payment Date: ${formattedDate}

Thank you for your payment.

Regards,
School Management System
        `,

        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
                <h2>Payment Successful</h2>

                <p>Hello <strong>${studentName}</strong>,</p>

                <p>
                    Your payment has been successfully received.
                </p>

                <table style="border-collapse: collapse; width: 100%;">
                    <tr>
                        <td style="padding: 8px; border: 1px solid #ddd;">
                            <strong>Amount</strong>
                        </td>
                        <td style="padding: 8px; border: 1px solid #ddd;">
                            ₹${amount}
                        </td>
                    </tr>

                    <tr>
                        <td style="padding: 8px; border: 1px solid #ddd;">
                            <strong>Transaction ID</strong>
                        </td>
                        <td style="padding: 8px; border: 1px solid #ddd;">
                            ${transactionId}
                        </td>
                    </tr>

                    <tr>
                        <td style="padding: 8px; border: 1px solid #ddd;">
                            <strong>Payment Date</strong>
                        </td>
                        <td style="padding: 8px; border: 1px solid #ddd;">
                            ${formattedDate}
                        </td>
                    </tr>
                </table>

                <p>
                    Thank you for your payment.
                </p>

                <p>
                    Regards,<br>
                    <strong>School Management System</strong>
                </p>
            </div>
        `,
    });
};

// Payment failed email
const sendPaymentFailedEmail = async ({
    to,
    studentName,
    amount,
    reason = 'Payment could not be completed',
}) => {
    return await sendEmail({
        to,
        subject: 'Payment Failed - School Management System',

        text: `
Hello ${studentName},

Unfortunately, your payment of ₹${amount} could not be completed.

Reason: ${reason}

Please try again or contact the school administration.

Regards,
School Management System
        `,

        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
                <h2>Payment Failed</h2>

                <p>Hello <strong>${studentName}</strong>,</p>

                <p>
                    Unfortunately, your payment of
                    <strong>₹${amount}</strong>
                    could not be completed.
                </p>

                <p>
                    <strong>Reason:</strong> ${reason}
                </p>

                <p>
                    Please try again or contact the school administration.
                </p>

                <p>
                    Regards,<br>
                    <strong>School Management System</strong>
                </p>
            </div>
        `,
    });
};

module.exports = {
    sendPaymentSuccessEmail,
    sendPaymentFailedEmail,
};