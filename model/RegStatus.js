const mongoose = require("mongoose");

const RegStatusSchema = mongoose.Schema({
  key: Number,
  value: String,
  color: String,
});

const RegStatusModel = mongoose.model(
  "regStatus",
  RegStatusSchema,
  "regStatus"
);

module.exports = RegStatusModel;
