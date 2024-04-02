const express = require("express");
const router = express.Router();
const CarouselModel = require("../model/Carousel");

// 获取轮播图列表
router.get("/getCarousel", async (req, res) => {
  try {
    const data = await CarouselModel.find({ type: "home" });
    res.json({
      code: 200,
      data,
      msg: "获取轮播图信息成功",
    });
  } catch (err) {
    console.log(err);
    res.json({
      code: 500,
      data: null,
      msg: "获取轮播图信息失败",
    });
  }
});

module.exports = router;
