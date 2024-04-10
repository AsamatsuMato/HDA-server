const mongoose = require("mongoose");

const OrderSchema = mongoose.Schema({
  openId: String,
  nickName: String,
  orderCode: String,
  orderTime: String,
  amount: Number,
  consumptionType: String, // 消费类型
  isDelete: Number,
});

const OrderModel = mongoose.model("orders", OrderSchema);

module.exports = OrderModel;
