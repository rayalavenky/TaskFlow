
const transporter = require("./email.transporter");

const sendVerificationOTP = async (email, otp) => {
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: email,
    subject: "Verify Your Email Address",
    text: `Your email verification OTP is: ${otp}\n\nThis OTP expires in 5 minutes. If you did not request it, please ignore this email.`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Verify Your Email Address</h2>
        <p>Use the following OTP to verify your email address:</p>
        <h1 style="letter-spacing: 6px;">${otp}</h1>
        <p>This OTP expires in 5 minutes.</p>
        <p>If you did not request this code, please ignore this email.</p>
      </div>
    `,
  });
};

const sendLoginOTP = async (email, otp) => {
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: email,
    subject: "Your Login Verification Code",
    text: `Your login OTP is: ${otp}\n\nThis OTP expires in 5 minutes. If you did not request it, please ignore this email.`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Complete Your Login</h2>
        <p>Use the following OTP to complete your login:</p>
        <h1 style="letter-spacing: 6px;">${otp}</h1>
        <p>This OTP expires in 5 minutes.</p>
        <p>If you did not request this code, please ignore this email.</p>
      </div>
    `,
  });
};

module.exports = {
  sendVerificationOTP,
  sendLoginOTP,
};