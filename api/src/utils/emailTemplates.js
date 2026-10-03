// =====================================================
// Email Templates
// =====================================================

// Common email layout
const emailLayout = (title, content) => {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>${title}</title>
</head>

<body style="
    margin: 0;
    padding: 0;
    background-color: #f4f6f8;
    font-family: Arial, Helvetica, sans-serif;
">

    <div style="
        max-width: 600px;
        margin: 40px auto;
        background: #ffffff;
        border-radius: 10px;
        overflow: hidden;
        box-shadow: 0 4px 15px rgba(0,0,0,0.08);
    ">

        <!-- Header -->
        <div style="
            background: #2563eb;
            color: #ffffff;
            padding: 25px;
            text-align: center;
        ">
            <h1 style="margin: 0;">
                School Web App
            </h1>

            <p style="
                margin: 8px 0 0;
                font-size: 14px;
            ">
                School Management System
            </p>
        </div>

        <!-- Content -->
        <div style="
            padding: 30px;
            color: #333333;
            line-height: 1.6;
        ">
            ${content}
        </div>

        <!-- Footer -->
        <div style="
            padding: 20px;
            text-align: center;
            background: #f8fafc;
            color: #777777;
            font-size: 12px;
        ">
            <p style="margin: 0;">
                © ${new Date().getFullYear()} School Web App
            </p>

            <p style="margin: 5px 0 0;">
                This is an automated email. Please do not reply.
            </p>
        </div>

    </div>

</body>
</html>
`;
};


// =====================================================
// Welcome Email
// =====================================================

const welcomeEmail = (name) => {
    return emailLayout(
        'Welcome to School Web App',
        `
            <h2>Welcome, ${name}!</h2>

            <p>
                Your account has been successfully created.
            </p>

            <p>
                You can now log in to the School Web App
                and access your account.
            </p>

            <p>
                Thank you for joining us.
            </p>
        `
    );
};


// =====================================================
// Email Verification
// =====================================================

const verificationEmail = (name, verificationUrl) => {
    return emailLayout(
        'Verify Your Email',
        `
            <h2>Hello ${name},</h2>

            <p>
                Please verify your email address to activate
                your School Web App account.
            </p>

            <div style="text-align: center; margin: 30px 0;">
                <a href="${verificationUrl}"
                   style="
                       display: inline-block;
                       padding: 12px 25px;
                       background: #2563eb;
                       color: #ffffff;
                       text-decoration: none;
                       border-radius: 6px;
                       font-weight: bold;
                   ">
                    Verify Email
                </a>
            </div>

            <p>
                If you did not create this account, you can
                safely ignore this email.
            </p>
        `
    );
};


// =====================================================
// Password Reset Email
// =====================================================

const passwordResetEmail = (name, resetUrl) => {
    return emailLayout(
        'Reset Your Password',
        `
            <h2>Hello ${name},</h2>

            <p>
                We received a request to reset your password.
            </p>

            <p>
                Click the button below to create a new password.
            </p>

            <div style="text-align: center; margin: 30px 0;">
                <a href="${resetUrl}"
                   style="
                       display: inline-block;
                       padding: 12px 25px;
                       background: #dc2626;
                       color: #ffffff;
                       text-decoration: none;
                       border-radius: 6px;
                       font-weight: bold;
                   ">
                    Reset Password
                </a>
            </div>

            <p>
                This link should only be used by you.
                If you did not request a password reset,
                please ignore this email.
            </p>
        `
    );
};


// =====================================================
// Password Changed Email
// =====================================================

const passwordChangedEmail = (name) => {
    return emailLayout(
        'Password Changed',
        `
            <h2>Hello ${name},</h2>

            <p>
                Your password has been successfully changed.
            </p>

            <p>
                If you made this change, no further action
                is required.
            </p>

            <p style="color: #dc2626;">
                If you did not make this change, please contact
                the school administrator immediately.
            </p>
        `
    );
};


// =====================================================
// Announcement Email
// =====================================================

const announcementEmail = (
    recipientName,
    announcementTitle,
    announcementContent
) => {
    return emailLayout(
        announcementTitle,
        `
            <h2>Hello ${recipientName},</h2>

            <h3>${announcementTitle}</h3>

            <p>
                ${announcementContent}
            </p>

            <p>
                Please log in to the School Web App for
                more details.
            </p>
        `
    );
};


// =====================================================
// Export
// =====================================================

module.exports = {
    emailLayout,
    welcomeEmail,
    verificationEmail,
    passwordResetEmail,
    passwordChangedEmail,
    announcementEmail
};