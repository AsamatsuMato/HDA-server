const mongoose = require("mongoose");

const QuestionnaireSchema = mongoose.Schema({
  qCode: String,
  question: String,
  options: Array,
});

const QuestionnaireModel = mongoose.model(
  "questionnaires",
  QuestionnaireSchema,
  "questionnaires"
);

module.exports = QuestionnaireModel;
