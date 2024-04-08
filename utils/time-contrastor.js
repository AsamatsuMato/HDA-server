module.exports = (timeperiod) => {
  // 分割时间范围字符串为开始时间和结束时间
  const timeRangeArray = timeperiod.split("-");
  const startTimeString = timeRangeArray[0];
  const endTimeString = timeRangeArray[1];

  // 将开始时间和结束时间转换为日期对象
  const startDate = new Date();
  const startTimeComponents = startTimeString.split(":");
  startDate.setHours(parseInt(startTimeComponents[0], 10));
  startDate.setMinutes(parseInt(startTimeComponents[1], 10));
  startDate.setSeconds(0);

  const endDate = new Date();
  const endTimeComponents = endTimeString.split(":");
  endDate.setHours(parseInt(endTimeComponents[0], 10));
  endDate.setMinutes(parseInt(endTimeComponents[1], 10));
  endDate.setSeconds(0);

  return { startDate, endDate };
};
