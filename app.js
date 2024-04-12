const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
// const logger = require("morgan");
// 导入 cors 解决跨域问题
const cors = require("cors");

// 导入记录日志中间件
// const recordLogMiddleware = require("./middleware/recordLogMiddleware"); // 会报错, 已弃用
const log4js = require("./utils/log4js.js");

const indexRouter = require("./routes/index");
const hospitalRouter = require("./routes/hospital");
const loginRouter = require("./routes/login");
const patientRouter = require("./routes/patient");
const departmentRouter = require("./routes/department");
const doctorRouter = require("./routes/doctor");
const registeredRouter = require("./routes/registered");
const orderRouter = require("./routes/order");
const userRouter = require("./routes/user");
const packageRouter = require("./routes/package");

const app = express();

// 全局挂载记录日志中间件
// app.use(recordLogMiddleware); // 会报错, 已弃用

// app.use(logger("dev")); // 不需要控制台输出请求日志, 影响性能
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());

app.use(log4js);

app.use("/hda/home", indexRouter);
app.use("/hda/hospital", hospitalRouter);
app.use("/hda/login", loginRouter);
app.use("/hda/patient", patientRouter);
app.use("/hda/department", departmentRouter);
app.use("/hda/doctor", doctorRouter);
app.use("/hda/registered", registeredRouter);
app.use("/hda/order", orderRouter);
app.use("/hda/user", userRouter);
app.use("/hda/package", packageRouter);

// catch 404 and forward to error handler
/* app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
}); */

module.exports = app;
