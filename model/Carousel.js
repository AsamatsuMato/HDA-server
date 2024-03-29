const mongoose = require("mongoose");

const CarouselSchema = mongoose.Schema({
  url: String,
  type: String,
});

const CarouselModel = mongoose.model("carousels", CarouselSchema);

module.exports = CarouselModel;
