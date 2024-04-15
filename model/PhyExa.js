const mongoose = require("mongoose");

const PhyExaSchema = mongoose.Schema({
  openId: String,
  date: String,
  packageCode: String,
  packageName: String,
  phyExaCode: String,
  price: Number,
  name: String,
  idCard: String,
  birthday: String,
  phone: String,
  gender: Number,
  maritalStatus: Number,
  birthPlace: String,
  pastMedicalHistoryContent: String,
  allergicHistoryContent: String,
  appointmentTime: String,
  status: Number,
});

const PhyExaModel = mongoose.model("phyExas", PhyExaSchema, "phyExas");

module.exports = PhyExaModel;
