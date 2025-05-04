const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'Gmail', // or your email provider
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

exports.sendRestaurantRegistrationEmail = async (toEmail, restaurantName) => {
  try {
    await transporter.sendMail({
      from: '"Food Delivery App" <noreply@fooddelivery.com>',
      to: toEmail,
      subject: 'Restaurant Registration Submitted',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4f46e5;">Restaurant Registration Submitted</h2>
          <p>Dear Restaurant Owner,</p>
          <p>Your request to register <strong>${restaurantName}</strong> has been received and is being reviewed by our admin team.</p>
          <p>You will receive another email once your registration is approved.</p>
          <p>Thank you for joining our platform!</p>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
          <p style="font-size: 12px; color: #6b7280;">This is an automated message. Please do not reply.</p>
        </div>
      `,
    });
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};