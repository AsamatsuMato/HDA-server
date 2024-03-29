const express = require("express");
const router = express.Router();
const HospitalModel = require("../model/Hospital");

router.get("/getHospitalInfo", async (req, res) => {
  const data = await HospitalModel.find();
  res.json({
    code: 200,
    data: data[0],
    msg: "获取医院信息成功",
  });
});

module.exports = router;
