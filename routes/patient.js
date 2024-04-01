const express = require("express");
const router = express.Router();

const shortid = require("shortid");

const checkToken = require("../middleware/checkTokenMiddleware");

const PatientModel = require("../model/Patient");

// 获取就诊人信息
router.get("/getPatientInfo", checkToken, async (req, res) => {
  const { openId } = req.userInfo;
  try {
    const data = await PatientModel.find({ openId, isDelete: 0 });
    if (data.length === 0) {
      res.json({
        code: 200,
        data: null,
        msg: "暂未添加就诊人",
      });
    } else {
      const { name, idCard, birthday, phone, address, medicalCardNo } = data[0];
      res.json({
        code: 200,
        data: {
          name,
          idCard,
          birthday,
          phone,
          address,
          medicalCardNo,
        },
        msg: "获取就诊人信息成功",
      });
    }
  } catch (err) {
    console.log(err);
    res.json({
      code: 500,
      data: null,
      msg: "获取就诊人信息失败",
    });
  }
});

// 添加就诊人
router.post("/addPatient", checkToken, async (req, res) => {
  const { openId } = req.userInfo;
  const { name, idCard, birthday, phone, address } = req.body;
  console.log(typeof birthday, birthday);
  const medicalCardNo = `MCN-${shortid()}`;
  try {
    await PatientModel.create({
      openId,
      name,
      idCard,
      birthday,
      phone,
      address,
      medicalCardNo,
      isDelete: 0,
    });
    res.json({
      code: 200,
      data: null,
      msg: "添加就诊人成功",
    });
  } catch (err) {
    console.log(err);
    res.json({
      code: 500,
      data: null,
      msg: "添加就诊人失败",
    });
  }
});

// 就诊人解除绑定
router.get("/deletePatient", async (req, res) => {
  const { medicalCardNo } = req.query;
  try {
    await PatientModel.updateOne({ medicalCardNo }, { isDelete: 1 });
    res.json({
      code: 200,
      data: null,
      msg: "就诊人解除绑定成功",
    });
  } catch (err) {
    console.log(err);
    res.json({
      code: 500,
      data: null,
      msg: "就诊人解除绑定失败",
    });
  }
});

module.exports = router;
