const express = require("express");
const router = express.Router();
const DepartmentModel = require("../model/Department");

router.get("/getDepartmentList", async (req, res) => {
  try {
    const data = await DepartmentModel.find().select({ _id: 0 });
    res.json({
      code: 200,
      data,
      msg: "获取科室列表成功",
    });
  } catch (err) {
    console.log(err);
    res.json({
      code: 500,
      data: [],
      msg: "获取科室列表失败",
    });
  }
});

module.exports = router;
