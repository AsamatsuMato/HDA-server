const CryptoJS = require("crypto-js");

const secretKey = "CHECK-HEART-DETECTING-APARTMENT-SECRETKEY";

module.exports = function decrypt(ciphertext) {
  const bytes = CryptoJS.AES.decrypt(ciphertext, secretKey);
  const originalText = bytes.toString(CryptoJS.enc.Utf8);
  return originalText;
};
