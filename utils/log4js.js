const log4js = require("log4js");

log4js.configure({
  appenders: {
    // 控制台输出
    /* out: {
      type: "stdout",
      layout: {
        type: "colored",
      },
    }, */
    //文件输出
    file: {
      filename: "logs/interview.log",
      type: "file",
    },
  },
  categories: {
    default: {
      appenders: ["file"],
      level: "debug",
    },
  },
});
const logger = log4js.getLogger("default");
const LoggerMiddleware = (req, res, next) => {
  if (req.method === "GET") {
    logger.debug(
      `[${req.method}] -- ${res.statusCode} -- ${req.ip} -- ${
        req.url
      } -- ${JSON.stringify(req.query)}`
    );
  } else {
    logger.debug(
      `[${req.method}] -- ${res.statusCode} -- ${req.ip} -- ${
        req.url
      } -- ${JSON.stringify(req.body)}`
    );
  }
  next();
};

module.exports = LoggerMiddleware;
