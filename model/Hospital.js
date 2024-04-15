const mongoose = require("mongoose");

const HospitalSchema = mongoose.Schema({
  logo: String,
  name: String,
  phone: String,
  location: String,
  introduce: String,
  latitude: Number,
  longitude: Number,
});

const HospitalModel = mongoose.model("hospitals", HospitalSchema);

module.exports = HospitalModel;
