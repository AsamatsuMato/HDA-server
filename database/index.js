module.exports = (success, error) => {
  if (typeof error !== "function") {
    error = () => {
      console.log("------连接错误------");
    };
  }

  const mongoose = require("mongoose");
  const { DBHOST, DBPORT, DBNAME } = require("../config/index");

  mongoose.connect(`mongodb://${DBHOST}:${DBPORT}/${DBNAME}`);

  mongoose.connection.once("open", () => {
    success();
  });

  mongoose.connection.on("error", () => {
    error();
  });

  mongoose.connection.on("close", () => {
    console.log("------连接关闭------");
  });
};
