const mongoose = require("mongoose");

const QuestionnaireSFillingchema = mongoose.Schema({
  submitTime: String,
  result: Array,
});

const QuestionnaireFillingModel = mongoose.model(
  "questionnaireFillings",
  QuestionnaireSFillingchema,
  "questionnaireFillings"
);

module.exports = QuestionnaireFillingModel;
