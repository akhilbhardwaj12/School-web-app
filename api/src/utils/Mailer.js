// =====================================================
// Mailer Utility
// =====================================================

const nodemailer = require('nodemailer');

// Create mail transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});

// Verify mail configuration
const verifyMailer = async () => {
    try {
        await transporter.verify();
        console.log('Mailer is ready');
        return true;
    } catch (error) {
        console.error('Mailer configuration failed:', error.message);
        return false;
    }
};

// Send email
const sendEmail = async ({
    to,
    subject,
    text = '',
    html = '',
}) => {
    try {
        if (!to) {
            throw new Error('Recipient email is required');
        }

        if (!subject) {
            throw new Error('Email subject is required');
        }

        const mailOptions = {
            from: `"School Management System" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            text,
            html,
        };

        const info = await transporter.sendMail(mailOptions);

        console.log(`Email sent successfully to ${to}`);

        return {
            success: true,
            messageId: info.messageId,
        };
    } catch (error) {
        console.error('Email sending failed:', error.message);

        return {
            success: false,
            message: error.message,
        };
    }
};

module.exports = {
    transporter,
    verifyMailer,
    sendEmail,
};