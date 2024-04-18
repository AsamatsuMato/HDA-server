const express = require("express");
const router = express.Router();
const QuestionnaireModel = require("../model/Questionnaire");

// 获取问卷列表
router.get("/getQuestionnairesList", async (req, res) => {
  try {
    const data = await QuestionnaireModel.find().select({ _id: 0 });
    res.json({
      code: 200,
      data,
      msg: "获取问卷列表成功",
    });
  } catch (err) {
    res.json({
      code: 500,
      data: null,
      msg: "获取问卷列表失败",
    });
    console.log(err);
  }
});

module.exports = router;
