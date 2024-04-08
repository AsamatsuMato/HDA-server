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
      try {
        req.on("data", (data) => {
          Object.assign(body, JSON.parse(data));
          resolve(body);
        });
      } catch (err) {
        console.log(err);
      }
    });
  }

  if (method === "GET") {
    fs.appendFileSync(
      path.resolve(__dirname + "/../logs/interview.log"),
      `${date}\t\t${method}\t\t${statusCode}\t\t${url}\t\t${ip}\t\t${JSON.stringify(
        query
      )}\r\n`
    );
  } else {
    getBody().then((body) => {
      fs.appendFileSync(
        path.resolve(__dirname + "/../logs/interview.log"),
        `${date}\t\t${method}\t\t${statusCode}\t\t${url}\t\t${ip}\t\t${JSON.stringify(
          body
        )}\r\n`
      );
    });
  }
  next();
};
