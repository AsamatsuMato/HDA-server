const mongoose = require("mongoose");

const RegisteredSchema = mongoose.Schema({
  regCode: String,
  patientName: String,
  medicalCardNo: String,
  appointmentTime: String,
  docCode: String,
  deptName: String,
  date: String,
  timeperiod: String,
  price: Number,
});

const RegisteredModel = mongoose.model("registereds", RegisteredSchema);

module.exports = RegisteredModel;
