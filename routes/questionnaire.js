const express = require("express");
const router = express.Router();
const QuestionnaireModel = require("../model/Questionnaire");
const QuestionnaireFillingModel = require("../model/QuestionnaireFilling");

const moment = require("moment");

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

router.post("/submitQuestionnaires", async (req, res) => {
  try {
    const { result } = req.body;
    await QuestionnaireFillingModel.create({
      submitTime: moment().format("YYYY-MM-DD HH:mm:ss"),
      result,
    });
    res.json({
      code: 200,
      data: req.body.result,
      msg: "提交问卷成功",
    });
  } catch (err) {
    res.json({
      code: 500,
      data: null,
      msg: "提交问卷失败, 请重新提交",
    });
    console.log(err);
  }
});

module.exports = router;
