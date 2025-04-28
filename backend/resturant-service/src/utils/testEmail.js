const sendEmail = require("../utils/emailService");

const testEmail = async () => {
  try {
    console.log("EMAIL_USER:", process.env.EMAIL_USER);
    console.log("EMAIL_PASS:", process.env.EMAIL_PASS);
    await sendEmail(
      "nethmi.nsr@gmail.com", // Replace with a valid recipient email
      "Test Email",
      "This is a test email from Nodemailer."
    );
    console.log("Test email sent successfully!");
  } catch (err) {
    console.error("Error sending test email:", err);
  }
};

testEmail();
