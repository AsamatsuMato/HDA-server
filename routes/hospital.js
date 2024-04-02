const express = require("express");
const router = express.Router();
const HospitalModel = require("../model/Hospital");

// 获取医院页信息
router.get("/getHospitalInfo", async (req, res) => {
  try {
    const data = await HospitalModel.find();
    res.json({
      code: 200,
      data: data[0],
      msg: "获取医院信息成功",
    });
  } catch (err) {
    console.log(err);
    res.json({
      code: 500,
      data: null,
      msg: "获取医院信息失败",
    });
  }
});

module.exports = router;
