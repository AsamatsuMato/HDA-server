//导入 jwt
const jwt = require("jsonwebtoken");
//读取配置项
const { SECRET } = require("../config");
//声明中间件
module.exports = (req, res, next) => {
  //获取 token
  const token = req.get("token");
  //判断
  if (!token) {
    return res.json({
      code: 1001,
      msg: "token缺失",
      data: null,
    });
  }
  //校验 token
  try {
    const verifyRes = jwt.verify(token, SECRET);
    //保存用户的信息
    req.userInfo = verifyRes;
    //如果 token 校验成功
    next();
  } catch (err) {
    res.json({
      code: 1002,
      msg: "token校验失败",
      data: null,
    });
  }
};
