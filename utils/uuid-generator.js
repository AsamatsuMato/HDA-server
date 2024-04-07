const { v4: uuidv4 } = require("uuid");

module.exports = function uuid() {
  const uuidWithDashes = uuidv4();
  // 移除横杠
  const uuid = uuidWithDashes.replace(/-/g, "");
  return uuid;
};
