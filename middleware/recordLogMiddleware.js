module.exports = (req, res, next) => {
  const monent = require("moment");
  const fs = require("fs");
  const path = require("path");

  const date = monent().format("YYYY-MM-DD HH:mm:ss");
  const { url, ip } = req;
  fs.appendFileSync(
    path.resolve(__dirname + "/../log/interview.log"),
    `${date}\t\t${url}\t\t${ip}\r\n`
  );
  next();
};
