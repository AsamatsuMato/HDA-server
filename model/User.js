const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  openId: String,
  nickName: String,
  avatar: String,
  lastLoginTime: String,
  balance: Number,
  paymentPwd: String,
});

const UserModel = mongoose.model("users", UserSchema);

module.exports = UserModel;
