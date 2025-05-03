const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",  // or "outlook", "yahoo" depending on your email
  auth: {
    user: "silunirupasinghe@gmail.com",  // your email address
    pass: "nkfy yrag hsam vcmb",  // app password, NOT your normal password
  },
});

const sendEmail = async (to, subject, text) => {
  try {
    console.log(`📨 Trying to send email to: ${to}`);
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
    });
    console.log("✅ Email sent successfully!");
  } catch (error) {
    console.error("❌ Error sending email:", error.message);
    throw error;
  }
};

module.exports = sendEmail;
