module.exports = (req, res, next) => {
  const monent = require("moment");
  const fs = require("fs");
  const path = require("path");

  const date = monent().format("YYYY-MM-DD HH:mm:ss");
  const { url, ip, method, query } = req;
  const { statusCode } = res;

  function getBody() {
    return new Promise((resolve, reject) => {
      const body = {};
      req.on("data", (data) => {
        Object.assign(body, JSON.parse(data));
        resolve(body);
      });
    });
  }

  getBody().then((body) => {
    if (method === "GET") {
      fs.appendFileSync(
        path.resolve(__dirname + "/../logs/interview.log"),
        `${date}\t\t${method}\t\t${statusCode}\t\t${url}\t\t${ip}\t\t${query}\r\n`
      );
    } else {
      fs.appendFileSync(
        path.resolve(__dirname + "/../logs/interview.log"),
        `${date}\t\t${method}\t\t${statusCode}\t\t${url}\t\t${ip}\t\t${JSON.stringify(
          body
        )}\r\n`
      );
    }
  });
  next();
};
