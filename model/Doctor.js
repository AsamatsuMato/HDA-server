const mongoose = require("mongoose");

const DoctorSchema = mongoose.Schema({
  remaining: Number,
  docCode: String,
  docName: String,
  position: String,
  docIntro: String,
  department: String,
  price: Number,
});

const DoctorModel = mongoose.model("doctors", DoctorSchema);

module.exports = DoctorModel;
