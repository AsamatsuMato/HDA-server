const express = require("express");
const router = express.Router();
const CarouselModel = require("../model/Carousel");

router.get("/getCarousel", async (req, res) => {
  const data = await CarouselModel.find({ type: "home" });
  res.json({
    code: 200,
    data,
    msg: "获取轮播图信息成功",
  });
});

module.exports = router;
