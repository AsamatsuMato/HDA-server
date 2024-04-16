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
    packageName,
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
    const phyExaCode = `PHY${uuid()}`;
    await PhyExaModel.create({
      openId,
      date,
      price,
      packageCode,
      packageName,
      phyExaCode,
      name,
      idCard,
      birthday,
      phone,
      gender,
      maritalStatus,
      birthPlace,
      pastMedicalHistoryContent,
      allergicHistoryContent,
      appointmentTime: moment().format("YYYY-MM-DD HH:mm:ss"),
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
      data: phyExaCode,
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

// 查询体检已预约列表
router.get("/getReservedList", checkToken, async (req, res) => {
  const { openId } = req.userInfo;
  const { status } = req.query;
  try {
    let data = [];
    if (status) {
      const reservedList = await PhyExaModel.find({ openId, status }).sort({
        _id: -1,
      });
      data = reservedList;
    } else {
      const packageList = await PackageModel.find();
      const reservedList = await PhyExaModel.find({ openId }).sort({ _id: -1 });
      reservedList.forEach((item) => {
        packageList.forEach((deepItem) => {
          if (item.packageCode === deepItem.packageCode) {
            data.push({
              phyExaCode: item.phyExaCode,
              packageName: deepItem.packageName,
              name: item.name,
              date: item.date,
              status: item.status,
              reportUrl: "/report.pdf",
            });
          }
        });
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

// 查询某条已预约记录的详情
router.get("/getReservedDetails", checkToken, async (req, res) => {
  const { phyExaCode } = req.query;
  try {
    const reservedList = await PhyExaModel.find({ phyExaCode }).select({
      _id: 0,
      __v: 0,
      openId: 0,
    });
    res.json({
      code: 200,
      data: reservedList[0],
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

// 取消体检预约
router.post("/cancelPhyExaAppointment", async (req, res) => {
  const { packageCode, phyExaCode, date } = req.body;
  try {
    try {
      const schedulingList = await PhyExaSchedulingModel.find({ date });
      const oldVal = lodash.cloneDeep(schedulingList[0]);
      schedulingList[0].value.forEach((item) => {
        if (item.packageCode === packageCode) {
          item.remaining += 1;
        }
      });
      await PhyExaSchedulingModel.updateOne(oldVal, schedulingList[0]);
    } catch (err) {
      res.json({
        code: 201,
        data: null,
        msg: "已过期, 取消预约失败",
      });
      console.log(err);
      return;
    }
    await PhyExaModel.updateOne({ phyExaCode }, { status: -1 });
    res.json({
      code: 200,
      data: null,
      msg: "取消预约成功",
    });
  } catch (err) {
    console.log(err);
    res.json({
      code: 500,
      data: null,
      msg: "取消预约失败",
    });
  }
});

module.exports = router;
