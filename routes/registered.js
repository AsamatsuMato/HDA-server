const express = require("express");
const router = express.Router();

const checkToken = require("../middleware/checkTokenMiddleware");

const DoctorModel = require("../model/Doctor");
const DepartmentModel = require("../model/Department");
const PatientModel = require("../model/Patient");
const RegisteredModel = require("../model/Registered");
const RegStatusModel = require("../model/RegStatus");
const SchedulingModel = require("../model/Scheduling");

const monent = require("moment");
const uuid = require("../utils/uuid-generator");
const lodash = require("lodash");

// 获取挂号确认预约信息
router.get("/getRegisteredConfirmInfo", checkToken, async (req, res) => {
  const { docCode } = req.query;
  try {
    const doctorInfo = await DoctorModel.find({
      docCode,
    });

    const { docName, position, price, deptCode } = doctorInfo[0];

    const departmentInfo = await DepartmentModel.find({ deptCode });
    const { deptName } = departmentInfo[0];

    res.json({
      code: 200,
      data: {
        docName,
        position,
        price,
        deptName,
      },
      msg: "获取挂号确认预约信息成功",
    });
  } catch (err) {
    console.log(err);
    res.json({
      code: 500,
      data: null,
      msg: "获取挂号确认预约信息失败",
    });
  }
});

// 确认预约挂号
router.post("/confirmRegistered", checkToken, async (req, res) => {
  const { docCode, date, timePeriod, price, medicalCardNo } = req.body;

  try {
    const result = await SchedulingModel.find({ date });
    const oldVal = lodash.cloneDeep(result[0]);
    result[0].value.forEach((item) => {
      if (docCode === item.docCode) {
        item.timePeriod.forEach((deepItem) => {
          if (timePeriod === deepItem.time && deepItem.remaining !== 0) {
            deepItem.remaining -= 1;
            console.log("-------------------有号源-------------------");
          }
        });
      }
    });

    try {
      const patientInfo = await PatientModel.find({
        medicalCardNo,
        isDelete: 0,
      });
      if (patientInfo.length !== 0) {
        const doctorInfo = await DoctorModel.find({
          docCode,
        });

        const { deptCode, docName } = doctorInfo[0];

        const departmentInfo = await DepartmentModel.find({ deptCode });
        const { deptName } = departmentInfo[0];

        const appointmentTime = monent().format("YYYY-MM-DD HH:mm:ss");

        try {
          const data = await RegisteredModel.create({
            regCode: `REG-${uuid()}`,
            patientName: patientInfo[0].name,
            medicalCardNo,
            appointmentTime,
            docCode,
            docName,
            deptName,
            date,
            timePeriod,
            price,
            status: 1, // 状态 "1" 为 "预约成功"
          });

          await SchedulingModel.updateOne(oldVal, result[0]);

          res.json({
            code: 200,
            data,
            msg: "挂号成功",
          });
        } catch (err) {
          console.log(err);
          await RegisteredModel.create({
            regCode: `REG-${uuid()}`,
            patientName: patientInfo[0].name,
            medicalCardNo,
            appointmentTime,
            docCode,
            docName,
            deptName,
            date,
            timePeriod,
            price,
            status: 0, // 状态 "0" 为 "预约失败"
          });
          res.json({
            code: 500,
            data: null,
            msg: "挂号失败",
          });
        }
      } else {
        await RegisteredModel.create({
          regCode: `REG-${uuid()}`,
          patientName: patientInfo[0].name,
          medicalCardNo,
          appointmentTime,
          docCode,
          docName,
          deptName,
          date,
          timePeriod,
          price,
          status: 0, // 状态 "0" 为 "预约失败"
        });
        res.json({
          code: 202,
          data: null,
          msg: "暂未找到该就诊人",
        });
      }
    } catch (err) {
      await RegisteredModel.create({
        regCode: `REG-${uuid()}`,
        patientName: patientInfo[0].name,
        medicalCardNo,
        appointmentTime,
        docCode,
        docName,
        deptName,
        date,
        timePeriod,
        price,
        status: 0, // 状态 "0" 为 "预约失败"
      });
      console.log(err);
      res.json({
        code: 500,
        data: null,
        msg: "挂号失败",
      });
    }
  } catch (err) {
    await RegisteredModel.create({
      regCode: `REG-${uuid()}`,
      patientName: patientInfo[0].name,
      medicalCardNo,
      appointmentTime,
      docCode,
      docName,
      deptName,
      date,
      timePeriod,
      price,
      status: 0, // 状态 "0" 为 "预约失败"
    });
    console.log(err);
    res.json({
      code: 201,
      data: null,
      msg: "号源不足",
    });
  }
});

// 挂号记录查询
router.post("/getRegisteredRecord", checkToken, async (req, res) => {
  const { medicalCardNo, regCode, status } = req.body;
  try {
    let data = [];
    if (regCode) {
      // 有 regCode, 为查询某条挂号记录, 用于挂号详情页查询
      const result = await RegisteredModel.find({
        medicalCardNo,
        regCode,
      }).select({ _id: 0, __v: 0 });
      data = result[0];
    } else if (status) {
      // 只有 status, 用于门诊缴费查询 "预约成功" 状态的挂号记录列表
      data = await RegisteredModel.find({ medicalCardNo, status })
        .select({ __v: 0 })
        .sort({ _id: -1 });
    } else {
      // 没有 regCode, 为查询列表的全部数据, 用于挂号记录查询页查询整个列表
      data = await RegisteredModel.find({
        medicalCardNo,
      })
        .select({ _id: 0, __v: 0 })
        .sort({ _id: -1 });
    }

    res.json({
      code: 200,
      data,
      msg: "挂号记录查询成功",
    });
  } catch (err) {
    console.log(err);
    res.json({
      code: 500,
      data: null,
      msg: "挂号记录查询失败",
    });
  }
});

// 挂号状态列表枚举
router.get("/getRegStatusList", checkToken, async (req, res) => {
  try {
    const data = await RegStatusModel.find().select({ _id: 0 });
    res.json({
      code: 200,
      data,
      msg: "挂号状态列表枚举查询成功",
    });
  } catch (err) {
    console.log(err);
    res.json({
      code: 500,
      data: null,
      msg: "挂号状态列表枚举查询失败",
    });
  }
});

// 取消预约
router.post("/cancelAppointment", async (req, res) => {
  const { regCode, docCode, date, timePeriod } = req.body;
  try {
    try {
      const result = await SchedulingModel.find({ date });
      const oldVal = lodash.cloneDeep(result[0]);
      result[0].value.forEach((item) => {
        if (docCode === item.docCode) {
          item.timePeriod.forEach((deepItem) => {
            if (timePeriod === deepItem.time && deepItem.remaining !== 0) {
              deepItem.remaining += 1;
            }
          });
        }
      });
      await SchedulingModel.updateOne(oldVal, result[0]);
    } catch (err) {
      res.json({
        code: 201,
        data: null,
        msg: "已过期, 取消预约失败",
      });
      console.log(err);
      return;
    }
    await RegisteredModel.updateOne({ regCode }, { status: -1 });
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
