const mongoose = require("mongoose");

const DepartmentSchema = mongoose.Schema({
  deptCode: String,
  deptName: String,
});

const DepartmentModel = mongoose.model("departments", DepartmentSchema);

module.exports = DepartmentModel;
