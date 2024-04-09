const express = require("express");
const router = express.Router();

const checkToken = require("../middleware/checkTokenMiddleware");

const OrderModel = require("../model/Order");
const UserModel = require("../model/User");

const monent = require("moment");
const uuid = require("../utils/uuid-generator");

// 透析预缴
router.post("/dialysisPrepayment", checkToken, async (req, res) => {
  const { openId, nickName } = req.userInfo;
  const { rechargeAmount, paymentPwd } = req.body;
  let balance = 0;
  try {
    const userList = await UserModel.find({ openId });
    if (paymentPwd !== userList[0].paymentPwd) {
      res.json({
        code: 201,
        data: null,
        msg: "支付密码错误, 预缴失败",
      });
      return;
    }
    balance = userList[0].balance;
    if (balance + rechargeAmount > 99999999) {
      res.json({
        code: 202,
        data: null,
        msg: "预缴金额超过最大值, 预缴失败",
      });
      return;
    }
  } catch (err) {
    console.log(err);
  }
  const orderCode = `HDA${uuid()}`;
  const orderTime = monent().format("YYYY-MM-DD HH:mm:ss");
  try {
    await OrderModel.create({
      openId,
      nickName,
      orderCode,
      orderTime,
      rechargeAmount,
      consumptionType: 1,
      isDelete: 0,
    });
    await UserModel.updateOne(
      { openId },
      { balance: balance + rechargeAmount }
    );
    res.json({
      code: 200,
      data: null,
      msg: "预缴成功",
    });
  } catch (err) {
    console.log(err);
    res.json({
      code: 500,
      data: null,
      msg: "预缴失败",
    });
  }
});

module.exports = router;
