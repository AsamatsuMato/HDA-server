const mongoose = require("mongoose");

const OrderSchema = mongoose.Schema({
  openId: String,
  nickName: String,
  orderCode: String,
  orderTime: String,
  rechargeAmount: Number,
  consumptionType: Number, // -1 为支出, 1 为充值
  isDelete: Number,
});

const OrderModel = mongoose.model("orders", OrderSchema);

module.exports = OrderModel;
