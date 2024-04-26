const express = require("express");
const router = express.Router();

const checkToken = require("../middleware/checkTokenMiddleware");

const UserModel = require("../model/User");

router.get("/getUserInfo", checkToken, async (req, res) => {
  const { openId } = req.userInfo;
  try {
    const userList = await UserModel.find({ openId }).select({
      _id: 0,
      __v: 0,
    });
    const data = userList[0];
    res.json({
      code: 200,
      data,
      msg: "查询用户个人信息成功",
    });
  } catch (err) {
    res.json({
      code: 500,
      data: null,
      msg: "查询用户个人信息失败",
    });
    console.log(err);
  }
});

router.post("/settingPaymentPwd", checkToken, async (req, res) => {
  try {
    const { paymentPwd } = req.body;
    const { openId } = req.userInfo;
    await UserModel.updateOne({ openId }, { paymentPwd });
    res.json({
      code: 200,
      data: null,
      msg: "支付密码设置成功",
    });
  } catch (err) {
    res.json({
      code: 500,
      data: null,
      msg: "支付密码设置失败",
    });
    console.log(err);
  }
});

module.exports = router;
