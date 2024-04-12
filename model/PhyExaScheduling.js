const mongoose = require("mongoose");

const PhyExaSchedulingSchema = mongoose.Schema({
  date: String,
  value: Array,
});

const PhyExaSchedulingModel = mongoose.model(
  "phyExaSchedulings",
  PhyExaSchedulingSchema,
  "phyExaSchedulings"
);

module.exports = PhyExaSchedulingModel;
