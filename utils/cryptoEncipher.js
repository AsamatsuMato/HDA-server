const CryptoJS = require("crypto-js");

const secretKey = "CHECK-HEART-DETECTING-APARTMENT-SECRETKEY";

module.exports = function decrypt(ciphertext) {
  const originalText = CryptoJS.AES.decrypt(ciphertext, secretKey).toString(
    CryptoJS.enc.Utf8
  );
  return originalText;
};
