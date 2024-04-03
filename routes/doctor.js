const express = require("express");
const router = express.Router();

const checkToken = require("../middleware/checkTokenMiddleware");

const DoctorModel = require("../model/Doctor");
const SchedulingModel = require("../model/Scheduling");

// 获取指定科室的医生列表
router.post("/getDoctorList", checkToken, async (req, res) => {
  const { deptCode, date } = req.body;
  try {
    const doctorRes = await DoctorModel.find({ deptCode }).select({
      _id: 0,
      deptCode: 0,
    });

    const schedulingRes = await SchedulingModel.find({ date });
    if (schedulingRes.length !== 0) {
      const { value } = schedulingRes[0];

      doctorRes.forEach((doctorResItem) => {
        value.forEach((valueItem) => {
          if (doctorResItem.docCode === valueItem.docCode) {
            valueItem.timePeriod.forEach((element) => {
              doctorResItem.remaining += element.remaining;
            });
          }
        });
      });

      res.json({
        code: 200,
        data: doctorRes,
        msg: "获取医生列表成功",
      });
    } else {
      res.json({
        code: 201,
        data: [],
        msg: "该日期没有排班医生",
      });
    }
  } catch (err) {
    console.log(err);
    res.json({
      code: 500,
      data: null,
      msg: "获取医生列表失败",
    });
  }
});

// 获取医生信息
router.get("/getDoctorInfo", checkToken, async (req, res) => {
  const { docCode } = req.query;
  try {
    const data = await DoctorModel.find({ docCode }).select({
      _id: 0,
      deptCode: 0,
      remaining: 0,
      price: 0,
    });
    res.json({
      code: 200,
      data: data[0],
      msg: "获取医生信息成功",
    });
  } catch (err) {
    console.log(err);
    res.json({
      code: 500,
      data: null,
      msg: "获取医生信息失败",
    });
  }
});

// 获取指定医生的排班列表
router.post("/getScheduling", checkToken, async (req, res) => {
  const { docCode, date } = req.body;
  try {
    const schedulingRes = await SchedulingModel.find({ date });
    if (schedulingRes.length !== 0) {
      const { timePeriod } = schedulingRes[0].value.find((item) => {
        return item.docCode === docCode;
      });
      res.json({
        code: 200,
        data: timePeriod,
        msg: "获取排班信息成功",
      });
    } else {
      res.json({
        code: 201,
        data: [],
        msg: "该日期暂无排班信息",
      });
    }
  } catch (err) {
    console.log(err);
    res.json({
      code: 500,
      data: null,
      msg: "获取排班信息失败",
    });
  }
});

module.exports = router;
