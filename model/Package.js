const mongoose = require("mongoose");

const PackageSchema = mongoose.Schema({
  packageCode: String,
  packageName: String,
  tags: Array,
  originalPrice: Number,
  preferentialPrice: Number,
  packageIntro: String,
  packageDetails: Array,
});

const PackageModel = mongoose.model("packages", PackageSchema, "packages");

module.exports = PackageModel;
