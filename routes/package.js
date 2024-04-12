const express = require("express");
const router = express.Router();

const checkToken = require("../middleware/checkTokenMiddleware");

const PackageModel = require("../model/Package");
const PhyExaSchedulingModel = require("../model/PhyExaScheduling");
const PhyExaModel = require("../model/PhyExa");

const IdentityCodeValid = require("../utils/checkIdCard");

const moment = require("moment");
const uuid = require("../utils/uuid-generator");
const lodash = require("lodash");

// 获取体检套餐列表 or 详情
router.get("/getPhysicalExaminationList", checkToken, async (req, res) => {
  const { packageCode } = req.query;
  try {
    let data;
    if (packageCode) {
      const result = await PackageModel.find({
        packageCode,
      }).select({
        _id: 0,
      });
      data = result[0];
    } else {
      data = await PackageModel.find().select({
        _id: 0,
        packageDetails: 0,
      });
    }
    res.json({
      code: 200,
      data,
      msg: "查询成功",
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

// 获取指定体检套餐排期
router.get("/getPhyExaScheduling", checkToken, async (req, res) => {
  try {
    const data = await PhyExaSchedulingModel.find().select({ _id: 0 });
    res.json({
      code: 200,
      data,
      msg: "查询成功",
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

// 预约体检
router.post("/bookPhysicalExamination", checkToken, async (req, res) => {
  const { openId } = req.userInfo;
  const {
    date,
    packageCode,
    price,
    name,
    idCard,
    birthday,
    phone,
    gender,
    maritalStatus,
    birthPlace,
    pastMedicalHistoryContent,
    allergicHistoryContent,
  } = req.body;
  if (!name) {
    res.json({
      code: 201,
      data: null,
      msg: "姓名不能为空",
    });
    return;
  } else if (!idCard) {
    res.json({
      code: 202,
      data: null,
      msg: "身份证号不能为空",
    });
    return;
  } else if (!birthday) {
    res.json({
      code: 203,
      data: null,
      msg: "出生日期不能为空",
    });
    return;
  } else if (!phone) {
    res.json({
      code: 204,
      data: null,
      msg: "联系电话不能为空",
    });
    return;
  } else if (!birthPlace) {
    res.json({
      code: 205,
      data: null,
      msg: "出生地不能为空",
    });
    return;
  }

  if (IdentityCodeValid(idCard) !== "成功通过了验证" || idCard.length !== 18) {
    res.json({
      code: 206,
      data: null,
      msg: "身份证格式错误",
    });
    return;
  }

  const regex = /^1[3-9]\d{9}$/;
  if (!regex.test(phone)) {
    res.json({
      code: 207,
      data: null,
      msg: "手机号格式错误",
    });
    return;
  }

  try {
    await PhyExaModel.create({
      openId,
      date,
      price,
      packageCode,
      phyExaCode: `PHY${uuid()}`,
      name,
      idCard,
      birthday,
      phone,
      gender,
      maritalStatus,
      birthPlace,
      pastMedicalHistoryContent,
      allergicHistoryContent,
      appointmentTime: moment().format("YYYY-MM-DD"),
      status: 1,
    });

    const schedulingList = await PhyExaSchedulingModel.find({ date });
    if (schedulingList.length === 0) {
      res.json({
        code: 208,
        data: null,
        msg: "该日期暂无排班",
      });
      return;
    } else {
      const oldVal = lodash.cloneDeep(schedulingList[0]);
      schedulingList[0].value.forEach((item) => {
        if (item.packageCode === packageCode) {
          if (item.remaining === 0) {
            res.json({
              code: 209,
              data: null,
              msg: "该日期已约满",
            });
            return;
          } else {
            item.remaining -= 1;
          }
        }
      });
      await PhyExaSchedulingModel.updateOne(oldVal, schedulingList[0]);
    }

    res.json({
      code: 200,
      data: null,
      msg: "预约成功",
    });
  } catch (err) {
    res.json({
      code: 500,
      data: null,
      msg: "预约失败",
    });
    console.log(err);
  }
});

module.exports = router;
