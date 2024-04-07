const express = require("express");
const router = express.Router();

const checkToken = require("../middleware/checkTokenMiddleware");

const DoctorModel = require("../model/Doctor");
const DepartmentModel = require("../model/Department");
const PatientModel = require("../model/Patient");
const RegisteredModel = require("../model/Registered");
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

        const { deptCode } = doctorInfo[0];

        const departmentInfo = await DepartmentModel.find({ deptCode });
        const { deptName } = departmentInfo[0];

        const appointmentTime = monent().format("YYYY-MM-DD HH:mm:ss");

        try {
          await RegisteredModel.create({
            regCode: `REG-${uuid()}`,
            patientName: patientInfo[0].name,
            medicalCardNo,
            appointmentTime,
            docCode,
            deptName,
            date,
            timePeriod,
            price,
          });

          await SchedulingModel.updateOne(oldVal, result[0]);

          res.json({
            code: 200,
            data: null,
            msg: "挂号成功",
          });
        } catch (err) {
          console.log(err);
          res.json({
            code: 500,
            data: null,
            msg: "挂号失败",
          });
        }
      } else {
        res.json({
          code: 202,
          data: null,
          msg: "暂未找到该就诊人",
        });
      }
    } catch (err) {
      console.log(err);
      res.json({
        code: 500,
        data: null,
        msg: "挂号失败",
      });
    }
  } catch (err) {
    console.log(err, "排班模块报错");
    res.json({
      code: 201,
      data: null,
      msg: "号源不足",
    });
  }
});

module.exports = router;
