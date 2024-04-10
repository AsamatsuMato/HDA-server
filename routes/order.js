const express = require("express");
const router = express.Router();

const checkToken = require("../middleware/checkTokenMiddleware");

const OrderModel = require("../model/Order");
const UserModel = require("../model/User");
const RegisteredModel = require("../model/Registered");

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
    res.json({
      code: 500,
      data: null,
      msg: "缴费失败",
    });
    return;
  }
  const orderCode = `HDA${uuid()}`;
  const orderTime = monent().format("YYYY-MM-DD HH:mm:ss");
  try {
    await OrderModel.create({
      openId,
      nickName,
      orderCode,
      orderTime,
      amount: rechargeAmount,
      consumptionType: "txyj",
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

// 挂号缴费
router.post("/registeredPayment", checkToken, async (req, res) => {
  const { openId, nickName } = req.userInfo;
  const { regCode, price, paymentPwd } = req.body;
  let balance = 0;
  try {
    const userList = await UserModel.find({ openId });
    if (paymentPwd !== userList[0].paymentPwd) {
      res.json({
        code: 201,
        data: null,
        msg: "支付密码错误, 缴费失败",
      });
      return;
    }
    balance = userList[0].balance;
    if (balance < price) {
      res.json({
        code: 202,
        data: null,
        msg: "余额不足, 缴费失败",
      });
      return;
    }
  } catch (err) {
    console.log(err);
    res.json({
      code: 500,
      data: null,
      msg: "缴费失败",
    });
    return;
  }
  const orderCode = `HDA${uuid()}`;
  const orderTime = monent().format("YYYY-MM-DD HH:mm:ss");
  try {
    await OrderModel.create({
      openId,
      nickName,
      orderCode,
      orderTime,
      amount: price,
      consumptionType: "gh",
      isDelete: 0,
    });
    await UserModel.updateOne({ openId }, { balance: balance - price });
    await RegisteredModel.updateOne({ regCode }, { status: 2 });
    res.json({
      code: 200,
      data: null,
      msg: "缴费成功",
    });
  } catch (err) {
    console.log(err);
    res.json({
      code: 500,
      data: null,
      msg: "缴费失败",
    });
  }
});

// 查询透析预缴记录列表
router.get("/getPrepaymentRecordList", checkToken, async (req, res) => {
  const { openId } = req.userInfo;
  try {
    const data = await OrderModel.find({
      openId,
      consumptionType: "txyj",
      isDelete: 0,
    })
      .select({ consumptionType: 0, isDelete: 0, openId: 0, _id: 0, __v: 0 })
      .sort({ orderTime: -1 });
    res.json({
      code: 200,
      data,
      msg: "查询透析预缴记录列表成功",
    });
  } catch (err) {
    res.json({
      code: 500,
      data: null,
      msg: "查询失败",
    });
    console.log(err);
  }
});

// 删除记录
router.get("/deletePrepaymentRecord", checkToken, async (req, res) => {
  const { orderCode } = req.query;
  try {
    await OrderModel.updateOne({ orderCode }, { isDelete: 1 });
    res.json({
      code: 200,
      data: null,
      msg: "删除成功",
    });
  } catch (err) {
    res.json({
      code: 500,
      data: null,
      msg: "删除失败",
    });
    console.log(err);
  }
});

module.exports = router;
