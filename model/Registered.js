const mongoose = require("mongoose");

const RegisteredSchema = mongoose.Schema({
  regCode: String,
  patientName: String,
  medicalCardNo: String,
  appointmentTime: String,
  docCode: String,
  docName: String,
  deptName: String,
  date: String,
  timePeriod: String,
  price: Number,
  status: Number,
});

const RegisteredModel = mongoose.model("registereds", RegisteredSchema);

module.exports = RegisteredModel;
