const crypto = require("crypto");

const generateOTP = () => {
    return crypto.randomInt(100000, 999999).toString(); // Generate a random 6-digit OTP
}

module.exports = generateOTP;