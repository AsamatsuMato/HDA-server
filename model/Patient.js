const mongoose = require("mongoose");

const PatientSchema = mongoose.Schema({
  openId: String,
  name: String,
  idCard: String,
  birthday: String,
  phone: String,
  address: String,
  medicalCardNo: String,
  isDelete: Number,
});

const PatientModel = mongoose.model("patients", PatientSchema);

module.exports = PatientModel;
