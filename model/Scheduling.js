const mongoose = require("mongoose");

const SchedulingSchema = mongoose.Schema({
  date: String,
  value: Array,
});

const SchedulingModel = mongoose.model("schedulings", SchedulingSchema);

module.exports = SchedulingModel;
